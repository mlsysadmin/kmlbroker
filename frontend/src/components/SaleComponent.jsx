import React from "react";
import "../styles/rent.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	CameraFilled,
	HeartOutlined,
	ControlOutlined,
} from "@ant-design/icons";
import Card from "./custom/cards/Card";
import property from "../images/Guest/property.png";
import Pagination from "./custom/pagination/Pagination";
import { FooterComponent, CustomMlFooter, ListingSearch, MainLayout, SearchPropertiesSoration } from ".";
import { GetPropertiesBySaleStatus, GetUnitPhotos } from "../api/GetAllPublicListings";
import { GetPhotoWithUrl, GetPhotoLength } from "../utils/GetPhoto";
import { CapitalizeString, FillLocationFilter, GetPropertyTitle } from "../utils/StringFunctions.utils";
import { CardSkeleton } from "./Skeleton";
import { AmountFormatterGroup } from "../utils/AmountFormatter";
import DefaultPropertyImage from '../asset/fallbackImage.png';
import NoDataAvailable from "./NoDataFoundComponent";
import { Breadcrumb } from "antd";

const SaleComponent = () => {

	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(true);

	const [publiclisting, setPublicListing] = useState([
		{
			id: 0,
			title: "",
			price: 0,
			status: "",
			pics: 0,
			img: DefaultPropertyImage,
			no_of_bathrooms: 0,
			lot: 0,
			property_no: '',
			isFeatured: '',
			sale_type: '',
			no_of_beds: '',
			property_type: '',
			city: ''
		}
	]);
	const [propertyType, setPropertyType] = useState("house-and-lot");
	const [currentPage, setCurrentPage] = useState(1);
	const cardsPerPage = 9;
	const [filterLocation, setFilterLocation] = useState([]);
	const [headerText, setHeaderText] = useState("House and Lot For Sale");
	const [searchParams, setSearchParams] = useState({
		location: "",
		price_min: 0,
		price_max: 100000000,
		keyword: "",
		property_type: "",
		bedrooms: 0,
		bathrooms: 0,
		parking: 0,
		sale_type: "",
		lot_area: ""
	});
	const [breadCrumbItems, setBreadCrumbItems] = useState([
		{
			title: 'For Sale',
		},
		{
			title: 'House and Lot',
		},
	]);

	const handleCardClick = (id) => {
		navigate(`/previewListing/?id=${id}`, { state: id });
	};

	const allPublicListing = async (property_type) => {
		try {
			const res = await GetPropertiesBySaleStatus();

			const dataresp = res.data;

			if (dataresp.length == 0) {
				setPublicListing([])
			} else {

				console.log("sale", dataresp.filter((listing) => ["sale"].includes(listing.SaleType.toLowerCase())));

				const listingRes = dataresp.filter((listing) =>
					["sale"].includes(listing.SaleType.toLowerCase())
					&& listing.PropertyType.toLowerCase() == property_type.replace(/[-_]/g, " "));

				if (listingRes.length !== 0) {
					const newListing = await Promise.all(listingRes.map(async (item, i) => {

						const getPhotoGallery = await GetUnitPhotos(item.id);

						const gallery = getPhotoGallery.data;

						const image = GetPhotoWithUrl(item.Photo);

						return {
							id: item.id,
							title: CapitalizeString(item.UnitName),
							price: AmountFormatterGroup(item.Price),
							status: "For Sale",
							pics: image ? gallery.length + 1 : 0,
							img: image,
							no_of_bathrooms: item.BathRooms,
							lot: item.LotArea,
							property_no: item.PropertyNo,
							isFeatured: item.IsFeatured,
							sale_type: CapitalizeString(item.SaleType),
							no_of_beds: item.BedRooms,
							property_type: item.PropertyType,
							city: item.City
						}
					}))
					const location = FillLocationFilter(newListing);
					setFilterLocation(location);
					setPublicListing(newListing);
					setLoading(false);

				} else {
					setPublicListing([]);
					setLoading(false);
				}

			}

		} catch (error) {
			console.error("ERROROR", error);
			setPublicListing([]);
			setLoading(false);
		}
	}

	useEffect(() => {

		const search = location.search;
		console.log(search);

		const queryParams = new URLSearchParams(search);
		const getPropertyType = queryParams.get("property_type");

		if (queryParams.size !== 0) {

			let title = "";

			getPropertyType.trim().replace(/[\/_-]/g, " ").split(' ').forEach((st) => {
				title += CapitalizeString(st) + " ";
			})
			title.trim();

			allPublicListing(getPropertyType);
			setPropertyType(getPropertyType);
			setHeaderText(`${title} For Sale`);
			setBreadCrumbItems([{ title: "For Sale" }, { title: title }])

		} else {
			allPublicListing("house-and-lot");
			setPropertyType("house-and-lot");
			setHeaderText("House and Lot For Sale");
		}

	}, [])

	const indexOfLastCard = currentPage * cardsPerPage;
	const indexOfFirstCard = indexOfLastCard - cardsPerPage;
	const currentCards = publiclisting.slice(indexOfFirstCard, indexOfLastCard);

	const totalPages = Math.ceil(publiclisting.length / cardsPerPage);

	return (
		<>
			<div className="rent">
				<div className="topbar">
					<ListingSearch location={filterLocation} searchParams={searchParams} setSearchFilters={setSearchParams} />
				</div>
				<div className="rentContainer">
					<Breadcrumb
						separator=">"
						items={breadCrumbItems}
						className="rent-h1 breadcrumb--search" />
					<span className="rent-h1">{headerText}</span>
					<SearchPropertiesSoration
						properties_count={publiclisting.length}
						current_properties_count={currentCards.length}
					/>
					{!loading ? (
						currentCards.length !== 0 ? (
							<div className="card-container">
								{currentCards.map((data, index) => (
									<Card
										key={index}
										id={data.id}
										title={data.title}
										price={`PHP ${data.price}`}
										imgSrc={data.img}
										beds={data.no_of_beds}
										baths={data.no_of_bathrooms}
										size={data.lot}
										likes={data.pics}
										forsale={data.status}
										subtitle={`${CapitalizeString(
											data.property_type
										)} For ${CapitalizeString(data.sale_type)}`}
										handleClick={() => handleCardClick(data.property_no)}
									/>
								))}
							</div>
						) : (
							<NoDataAvailable
								message={`No available ${CapitalizeString(
									propertyType.replace(/[-_]/g, " ")
								)} for rent`}
							/>
						)
					) : (
						<div
							className="card-skeleton-loading"
							style={{
								display: "flex",
								justifyContent: "center",
								gap: "20px",
							}}
						>
							{Array(3)
								.fill(null)
								.map((_, i) => (
									<CardSkeleton key={i} />
								))}
						</div>
					)}

					{currentCards.length > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							paginate={setCurrentPage}
						/>
					)}
				</div>
			</div>
			<CustomMlFooter />
			<FooterComponent />
		</>
	);
}

export default SaleComponent;
