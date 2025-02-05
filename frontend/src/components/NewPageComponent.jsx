import React, { useEffect, useState } from "react";
import "../styles/newpage.css";
import { useNavigate } from "react-router-dom";
import { FooterComponent, CustomMlFooter, MainLayout } from "../components";
import Card from "./custom/cards/Card";
import { SearchPropertiesSoration } from "../components";
import Pagination from "./custom/pagination/Pagination";
import SortDropdown from "../components/SortDropdownComponent"; // Ensure this path is correct
import { Dropdown, Menu, Space } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { cardData } from "../utils/ListingMockData";
import { CardSkeleton } from "./Skeleton";
import { getCookieData } from "../utils/CookieChecker";
import LoginMessageModal from "./modals/LoginMessageModal";

import property from "../images/Guest/property.png";
import ListingSearch from "./custom/customsearch/custom.listingsearch";
import { GetPropertiesBySaleStatus, GetUnitPhotos } from "../api/GetAllPublicListings";
import { GetPhotoWithUrl, GetPhotoLength } from "../utils/GetPhoto";
import { AmountFormatterGroup } from "../utils/AmountFormatter";
import { CapitalizeEachWord, CapitalizeStringwithSymbol, CapitalizeString, FillLocationFilter, GetPropertyTitle, isPastAMonth, SortByText, SortMaxPrice, SortPrice, TruncateText} from "../utils/StringFunctions.utils";
import DefaultPropertyImage from '../asset/fallbackImage.png';
import {FloatBtnGroup} from "../components";
import {FloatButton} from "antd";
import CalculatorWidgetModal from "./modals/CalculatorWidgetModal";
import ContactUsWidget from "./modals/ContactUsWidget";
import { MessageOutlined, CalculatorOutlined } from "@ant-design/icons";

const NewPageComponent = () => {
	const navigate = useNavigate();
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
			city: '',
			date: ""
		}
	]);
	const [loading, setLoading] = useState(true);
	 const [showLoginMessage, setShowLoginMessage] = useState(false);
	const [filterLocation, setFilterLocation] = useState([]);
	const [searchParams, setSearchParams] = useState({
		location: null,
		price_min: 1000,
		price_max: 100000000,
		keyword: null,
		property_type: null,
		bedrooms: null,
		bathrooms: null,
		parking: null,
		sale_type: null,
		lot_area: null,
	})

	const [isContactUsFormVisible, setContactUsFormVisible] = useState(false);
	const [isCalculatorVisible, setCalculatorVisible] = useState(false);
	const toggleCalculator = () => {
		setCalculatorVisible(!isCalculatorVisible);
		setContactUsFormVisible(false);
	};
	const closeWidgetCalc = () => {
		setCalculatorVisible(false);
		setContactUsFormVisible(false);
	};
	const toogleContarctUsForm = () => {
		setCalculatorVisible(false);
		setContactUsFormVisible(!isContactUsFormVisible);
	};
  const handleShowLoginModal = () => {
		setShowLoginMessage(true);
	};

   const handleCloseLoginModal = () => {
		setShowLoginMessage(false);
	};
	const handleCardClick = (id) => {
		navigate(`/previewListing/?id=${id}`, { state: id });
	};
	const accountDetails = getCookieData();

	let number = accountDetails?.mobileNumber || null;
	const allPublicListing = async () => {

		try {
			const res = await GetPropertiesBySaleStatus();

			const dataresp = res;

			if (dataresp.length == 0) {
				setPublicListing([]);
			} else {

				const listingRes = dataresp.filter(
					(listing) =>
						!isPastAMonth(listing.created_at) &&
						["sale", "rent", "pre-selling"].includes(listing.SaleType.toLowerCase())
				);

				let listings = [];

				if (listingRes?.length !== 0) {
					listings = listingRes;
				} else {
					listings = dataresp;
				}

				const newListing = await Promise.all(
					listings.map(async (item, i) => {
						const getPhotoGallery = await GetUnitPhotos(item.id);

						const gallery = getPhotoGallery.data;
                        const isRent =
													item.SaleType == "Rent" || item.SaleType == "rent";
						const image = GetPhotoWithUrl(item.Photo);

						return {
							id: item.id,
							title: CapitalizeString(item.UnitName),
							price: `PHP ${AmountFormatterGroup(item.Price)}${
								isRent ? "/mo." : ""
							}`,
							status: "New",
							pics: image ? gallery.length + 1 : 0,
							img: image,
							no_of_bathrooms: item.BathRooms,
							lot: item.LotArea,
							property_no: item.PropertyNo,
							isFeatured: item.IsFeatured,
							sale_type: CapitalizeString(item.SaleType),
							no_of_beds: item.BedRooms,
							property_type:
								item.PropertyType === "hotel/resort"
									? CapitalizeStringwithSymbol(item.PropertyType)
									: item.PropertyType,
							city: item.City,
							date: item.created_at,
							vendorId: item.VendorId,
						};
					})
				);
				const location = FillLocationFilter(dataresp);
				setFilterLocation(location);
				setPublicListing(newListing);
			console.log("public:", publiclisting);
				setLoading(false);
			}
		} catch (error) {
			console.error("ERROROR", error);
			setPublicListing([]);
			setLoading(false);
			// setLoading(false);
		}
	};

	useEffect(() => {
		allPublicListing();

	}, []);

	const [currentPage, setCurrentPage] = useState(1);
	const cardsPerPage = 9;
	const [selectedSort, setSelectedSort] = useState("Most relevant");

	const indexOfLastCard = currentPage * cardsPerPage;
	const indexOfFirstCard = indexOfLastCard - cardsPerPage;

	let currentCards = publiclisting?.slice(indexOfFirstCard, indexOfLastCard);

	const totalPages = Math.ceil(publiclisting.length / cardsPerPage);

	const HandleSort = (e) => {

		try {
			setSelectedSort(e.domEvent.target.innerText);
			const sortKey = e.key;
			let sortListing;

			if (sortKey == "price-asc") {
				sortListing = publiclisting.sort((a, b) => SortPrice(b, a));
			} else if (sortKey == "price-desc") {
				sortListing = publiclisting.sort((a, b) => SortPrice(a, b));
			} else if (sortKey == "new" || sortKey == "relevant") {
				sortListing = publiclisting.sort((a, b) => SortByText(b.date, a.date));
			} else if (sortKey == "old") {
				sortListing = publiclisting.sort((a, b) => SortByText(a.date, b.date))
			} else if (sortKey == "title-asc") {
				sortListing = publiclisting.sort((a, b) => SortByText(a.title, b.title))
			} else if (sortKey == "title-desc") {
				sortListing = publiclisting.sort((a, b) => SortByText(b.title, a.title))
			} else {
				sortListing = publiclisting;
			}
			console.log("sort", sortListing);


			currentCards = sortListing;
		} catch (error) {
			currentCards = []
		}
	}
	return (
		<div className="newpage">
			<div className="newpage-container">
				<div className="newpage-contents">
					<ListingSearch
						location={filterLocation}
						searchParams={searchParams}
						setSearchFilters={setSearchParams}
					/>
					<div className="second-content">
						<div className="new-page-full-content">
							<h1 className="new-page-label">New Properties For Sale/Rent</h1>
							<SearchPropertiesSoration
								properties_count={publiclisting.length}
								current_properties_count={currentCards.length}
								selectedSort={selectedSort}
								setSelectedSort={setSelectedSort}
								HandleSort={HandleSort}
							/>
							{!loading ? (
								currentCards.length > 0 && (
									<div className="card-container">
										{currentCards.map((data, index) => (
											<Card
												key={index}
												id={data.id}
												title={data.title}
												price={data.price}
												imgSrc={data.img}
												beds={data.no_of_beds}
												baths={data.no_of_bathrooms}
												size={data.lot}
												likes={data.pics}
												forsale={data.status}
												subtitle={`${CapitalizeEachWord(
													data.property_type
												)} For ${CapitalizeString(data.sale_type)}`}
												handleClick={() => handleCardClick(data.property_no)}
												propertyNo={data.property_no}
												vendorId={data.vendorId}
												number={number}
												handleShowLoginModalMessage={handleShowLoginModal}
											/>
										))}
										{showLoginMessage && (
											<LoginMessageModal
												setShowLoginMessage={setShowLoginMessage}
											/>
										)}
									</div>
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
										.map((_, i) => {
											return <CardSkeleton />;
										})}
								</div>
							)}

							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								paginate={setCurrentPage}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="listing__contact--form-btns-sticky">
				<FloatBtnGroup
					children={
						<>
							<a href="#contact-form">
								<FloatButton
									icon={
										<MessageOutlined className="message-float__icon--icon" />
									}
									tooltip={isContactUsFormVisible ? "" : "Message us"}
									className="float__icon message-float__icon"
									onClick={toogleContarctUsForm}
								/>
							</a>
							<FloatButton
								icon={<CalculatorOutlined className="calculator-float__icon" />}
								tooltip={isCalculatorVisible ? "" : "Calculator"}
								className="float__icon calculator-float__icon"
								onClick={toggleCalculator}
								// onClick={() => navigate("/discover-home#calculator")}
							/>
						</>
					}
				/>
			</div>
			{isCalculatorVisible && (
				<CalculatorWidgetModal
					toggleCalculator={toggleCalculator}
					closeWidgetCalc={closeWidgetCalc}
				/>
			)}
			{isContactUsFormVisible && (
				<ContactUsWidget closeWidgetCalc={closeWidgetCalc} />
			)}
			<CustomMlFooter />
			<FooterComponent />
		</div>
	);
};
export default NewPageComponent;