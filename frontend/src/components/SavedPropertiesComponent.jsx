import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, FloatButton } from "antd";
import { CaretDownOutlined, HeartOutlined , CalculatorOutlined, MessageOutlined} from "@ant-design/icons";
import RoundSelect from "./custom/selects/RoundSelect.custom";
import CardListingComponent from "./CardListingComponent";
import DefaultPropertyImage from "../asset/fallbackImage.png";
import { CardSkeleton, FeaturesSkeleton } from "./Skeleton";
import SemiRoundBtn from "./custom/buttons/SemiRoundBtn.custom";
import { getCookieData } from "../utils/CookieChecker";
import { GetSavedPropertiesBySellerNo } from "../api/Public/SavedProperties.api";
import { PropertyListing } from "../api/Public/PropertyListing.api";
import { GetPhotoWithUrl } from "../utils/GetPhoto";
import { AmountFormatterGroup } from "../utils/AmountFormatter";
import { GetUnitPhotos } from "../api/GetAllPublicListings";
import Pagination from "./custom/pagination/Pagination";
import NoDataAvailable from "./NoDataFoundComponent";
import { ListingForm } from "./ListingForm";
import { CustomMlFooter, FooterComponent, JoinTeam } from "../components";
import { useLocation } from "react-router-dom";
import {
	CapitalizeEachWord,
	CapitalizeString,
	CapitalizeStringwithSymbol,
	TruncateText,
} from "../utils/StringFunctions.utils";
import { GetVendorByNumber } from "../api/PostListings";
import "../styles/seller-broker/saved-properties.css";
import { useAuth } from "../Context/AuthContext";
import { HearingOutlined } from "@mui/icons-material";
import {FloatBtnGroup} from "../components";
import CalculatorWidgetModal from "./modals/CalculatorWidgetModal";
import ContactUsWidget from "./modals/ContactUsWidget";

const SavedPropertiesComponent = ({ isMLWWSPresent }) => {
	const { isAuthenticated, userDetails, logout } = useAuth();

	const [selectedSort, setSelectedSort] = useState("dateAdded");
	const [tabOpened, setTabOpened] = useState("");
	const [loading, setLoading] = useState(false);
	const [recordStatus, setIsRecordStatus] = useState("");
	const [SortTypes, setSortTypes] = useState([
		{
			label: "Date Added",
			value: "dateAdded",
		},
		{
			label: "Highest Price",
			value: "highestPrice",
		},
		{
			label: "Lowest Price",
			value: "lowestPrice",
		},
	]);
	const [number, setNumber] = useState("");

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

	

	useEffect(() => {
		const hash = window.location.hash.replace("#", "");
		setTabOpened(hash);
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			const accountDetails = userDetails;
			setNumber(accountDetails.mobileNumber);
		} else {
			// logout();
		}
	}, []);
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.replace("#", "");
			if (hash && items.some((item) => item.key === hash)) {
				onChange(hash); // Call onChange with the hash value
			}
		};

		// Initial check on mount
		handleHashChange();

		// Listen for hash changes
		window.addEventListener("hashchange", handleHashChange);

		// Cleanup the event listener on unmount
		return () => {
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, []);
	const [filteredAndSortedListings, setFilteredAndSortedListings] = useState([
		{
			id: 0,
			title: "",
			price: 0,
			status: "",
			pics: 0,
			img: DefaultPropertyImage,
			no_of_bathrooms: 0,
			lot: 0,
			property_no: "",
			isFeatured: "",
			sale_type: "",
			no_of_beds: "",
			city: "",
			property_type: "",
		},
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = filteredAndSortedListings.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	// Calculate total pages
	const totalPages = Math.ceil(
		filteredAndSortedListings?.length / itemsPerPage
	);

	const location = useLocation();
	const isSavedPropertiesRoute =
		location.pathname.includes("/saved-properties");
	const isSavedPropertiesTab = tabOpened === "savedProperties";

	const onChange = (key) => {
		setTabOpened(key);
		window.location.hash = key;
		if (key === "propertyListings") {
			setSelectedSort("allListings");
			setSortTypes([
				{
					label: "All Listing",
					value: "allListings",
				},
				{
					label: "Pending Listings",
					value: "pendingListings",
				},
				{
					label: "Approved Listings",
					value: "approvedListings",
				},
				{
					label: "Denied Listings",
					value: "deniedListings",
				},
			]);
		} else if (key === "savedProperties") {
			setSelectedSort("dateAdded");
			setSortTypes([
				{
					label: "Date Added",
					value: "dateAdded",
				},
				{
					label: "Highest Price",
					value: "highestPrice",
				},
				{
					label: "Lowest Price",
					value: "lowestPrice",
				},
			]);
		}
	};


	const handleDiscoverHomeBtn = () => {
		navigate("/new");
	}

	useEffect(() => {
		const fetchSavedProperties = async () => {
			setLoading(true);
			
			try {
				if (tabOpened === "savedProperties") {
					console.log("tabOpened", tabOpened);
					const savedProperties = await GetSavedPropertiesBySellerNo(number);
					const dataresp = savedProperties.data;

					if (!Array.isArray(dataresp)) {
						setFilteredAndSortedListings([]);
						return;
					}

					if (dataresp.length === 0) {
						setFilteredAndSortedListings([]);
						setLoading(false);
					} else {
						let listingRes = [...dataresp];

						if (listingRes.length === 0) {
							console.log("No Data Found");
						} else {
							if (selectedSort === "dateAdded") {
								listingRes.sort(
									(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
								);
							} else if (selectedSort === "oldest") {
								listingRes.sort(
									(a, b) => new Date(a.updated_at) - new Date(b.updated_at)
								);
							} else if (selectedSort === "highestPrice") {
								listingRes.sort((a, b) => b.Price - a.Price);
							} else if (selectedSort === "lowestPrice") {
								listingRes.sort((a, b) => a.Price - b.Price);
							} else {
								listingRes = [];
							}

							if (listingRes.length === 0) {
								setFilteredAndSortedListings([]);
								setLoading(false);
							} else {
								console.log("Filtered and Sorted Listings:", listingRes);
							}

							const newListing = await Promise.all(
								listingRes.map(async (item) => {
									const getPhotoGallery = await GetUnitPhotos(item.id);
									const gallery = getPhotoGallery.data;
									const isRent =
										item.SaleType == "Rent" || item.SaleType == "rent";
									const image = GetPhotoWithUrl(item.Photo);

									return {
										id: item.id,
										title: CapitalizeString(item.UnitName),
										price: `PHP ${AmountFormatterGroup(item.Price)}${isRent ? "/mo." : ""
											}`,
										status: "New",
										pics: image ? gallery.length + 1 : 1,
										img: image,
										no_of_bathrooms: item.BathRooms,
										lot: item.LotArea,
										property_no: item.PropertyNo,
										isFeatured: "yes",
										sale_type: CapitalizeString(item.SaleType),
										no_of_beds: item.BedRooms,
										property_type: item.PropertyType,
										city: item.City,
										province: item.ProvinceState,
									};
								})
							);

							setFilteredAndSortedListings(newListing);
							setLoading(false);
						}
					}
				} else {
					const vendorDetails = await GetVendorByNumber(number);
					console.log("vendorDetails: ",vendorDetails);
					if (vendorDetails.data) {
						const vendorDataId = vendorDetails.data.VendorId;
						console.log("vendorDataId: ",vendorDataId);
						
						const propertyListing = await PropertyListing(vendorDataId);
						const dataresp = propertyListing;
						if (dataresp.length == 0) {
							setFilteredAndSortedListings([]);
						} else {
							let listingRes = [...dataresp];
							if (selectedSort === "allListings") {
								listingRes = listingRes
									.filter((item) => item.updated_at) // No filtering; retain all listings
									.sort(
										(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
									);
							} else if (selectedSort === "pendingListings") {
								listingRes = listingRes
									.filter((item) => item.RecordStatus === "pending")
									.sort(
										(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
									);
							} else if (selectedSort === "approvedListings") {
								listingRes = listingRes
									.filter((item) => item.RecordStatus === "active")
									.sort(
										(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
									);
							} else if (selectedSort === "deniedListings") {
								listingRes = listingRes
									.filter((item) => item.RecordStatus === "rejected")
									.sort(
										(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
									);
							} else {
								listingRes = [];
							}

							if (listingRes.length === 0) {
								setFilteredAndSortedListings([]);
							} else {
								// console.log("listingRes: ", listingRes);
								const newListing = await Promise.all(
									listingRes.map(async (item, i) => {
										setIsRecordStatus(item.RecordStatus);
										const getPhotoGallery = await GetUnitPhotos(item.id);

										const gallery = getPhotoGallery.data;
										const isRent = item.SaleType == "Rent" || item.SaleType == "rent";

										const image = GetPhotoWithUrl(item.Photo);

										return {
											id: item.id,
											title: CapitalizeString(item.UnitName),
											price: `PHP ${AmountFormatterGroup(item.Price)}${isRent ? "/mo." : ""
												}`,
											status: "New",
											pics: image ? gallery.length + 1 : 1,
											img: image,
											no_of_bathrooms: item.BathRooms,
											lot: item.LotArea,
											property_no: item.PropertyNo,
											isFeatured: "yes",
											sale_type: CapitalizeString(item.SaleType),
											no_of_beds: item.BedRooms,
											// isFeatured: item.IsFeatured
											property_type: item.PropertyType,
											city: item.City,
											province: item.ProvinceState,
											recordStatus: item.RecordStatus,
											accessType: item.AccessType,
										};
									})
								);

								setFilteredAndSortedListings(newListing);
								setLoading(false);
							}
						}
					}
				}
			} catch (error) {
				// console.error("Error fetching saved properties:", error);
				setFilteredAndSortedListings([]);
				setLoading(false);
			}
		};
		fetchSavedProperties();
	}, [selectedSort, tabOpened]);

	const navigate = useNavigate();
	const handleCardClick = (id) => {
		// window.location.hasdref = `/previewListing/${id}`;
		navigate(`/previewListing/?id=${id}`, { state: id });
	};
	const handleSelect = (value) => {
		setSelectedSort(value);
	};
	const getListingLabel = (selectedSort) => {
		return selectedSort === "allListings"
			? "All Listings"
			: selectedSort === "pendingListings"
				? "Pending Lists"
				: selectedSort === "approvedListings"
					? "Approved Lists"
					: selectedSort === "deniedListings"
						? "Denied Lists"
						: "Unknown Listing";
	};

	const items = [
		{
			key: "listingForm",
			label: "Create Listing",
			children: (
				<>
					<div className="savedPropertiesContent">
						<ListingForm />
					</div>
				</>
			),
		},
		{
			key: "propertyListings",
			label: "Property Listings",
			children: (
				<div className="savedPropertiesContent">
					<p id="myPropertiesTextHeader">My Property Listings</p>
					<p id="myPropertiesTextSubHeader">
						Easily view and manage all your listings in one place.
					</p>
					<RoundSelect
						options={SortTypes}
						size="middle"
						classname="card-item field"
						suffixIcon={<CaretDownOutlined />}
						value={selectedSort}
						onSelectionChange={(e) => handleSelect(e)}
					></RoundSelect>
					<div className="cardBackgroundSavedProperties">
						{!loading ? (
							filteredAndSortedListings.length !== 0 ? (
								<div className="listing-carousel-saved-properties">
									{currentItems.map((item, i) => {
										return (
											<CardListingComponent
												title={item.title}
												price={item.price}
												status={item.status}
												pics={item.pics}
												img={item.img}
												no_of_bathrooms={item.no_of_bathrooms}
												no_of_beds={item.no_of_beds}
												lot={item.lot}
												key={i}
												loading={loading}
												subtitle={`${item.property_type === "hotel/resort"
														? CapitalizeStringwithSymbol(item.property_type)
														: CapitalizeEachWord(item.property_type)
													} For ${CapitalizeString(item.sale_type)}`}
												listingId={item.property_no}
												handleClick={() => handleCardClick(item.property_no)}
												sale_status={item.sale_type}
												isSavedProperties={{
													atSavedPropertiesPage: true,
													isRecordStatus: item.recordStatus,
													isAccessType: item.accessType,
												}}
												showDeleteIcon={
													isSavedPropertiesRoute && isSavedPropertiesTab
												}
											/>
										);
									})}
								</div>
							) : (
								<NoDataAvailable
									message={`No available Data that was been in ${getListingLabel(
										selectedSort
									)}`}
								/>
							)
						) : (
							<div
								className="listing-carousel-dashboard-skeleton"
								style={{
									display: "flex",
								}}
							>
								{Array(6)
									.fill(null)
									.map((_, i) => {
										return <CardSkeleton key={i} />;
									})}
							</div>
						)}
						{filteredAndSortedListings.length > 0 && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								paginate={setCurrentPage}
							/>
						)}
					</div>
				</div>
			),
		},
		{
			key: "savedProperties",
			label: "Saved Properties",
			children: (
				<div className="savedPropertiesContent">
					<p id="myPropertiesTextHeader">My Saved Properties</p>
					<p id="myPropertiesTextSubHeader">
						Access and manage your favorite properties in one place.
					</p>
					<RoundSelect
						options={SortTypes}
						size="middle"
						classname="card-item field"
						suffixIcon={<CaretDownOutlined />}
						value={selectedSort}
						onSelectionChange={(e) => handleSelect(e)}
					></RoundSelect>
					<div className="cardBackgroundSavedProperties">
						<div className="cardBackgroundPerRows">
							{!loading ? (
								filteredAndSortedListings.length !== 0 ? (
									<div className="listing-carousel-saved-properties">
										{filteredAndSortedListings.map((item, i) => {
											return (
												<CardListingComponent
													showDeleteIcon={
														isSavedPropertiesRoute && isSavedPropertiesTab
													}
													title={item.title}
													price={item.price}
													status={item.status}
													pics={item.pics}
													img={item.img}
													no_of_bathrooms={item.no_of_bathrooms}
													no_of_beds={item.no_of_beds}
													lot={item.lot}
													key={i}
													loading={loading}
													subtitle={`${item.property_type === "hotel/resort"
															? CapitalizeStringwithSymbol(item.property_type)
															: CapitalizeEachWord(item.property_type)
														} For ${CapitalizeString(item.sale_type)}`}
													listingId={item.property_no}
													handleClick={() => handleCardClick(item.property_no)}
													sale_status={item.sale_type}
													id={item.id}
													number={number}
													propertyNo={item.property_no}
												/>
											);
										})}
										<div
											style={{
												display: "none",
												justifyContent: "center",
											}}
											className="carousel--see-all-btn"
										>
											<SemiRoundBtn
												label={"See all new properties"}
												style={{
													borderColor: "#D90000",
													color: "#D90000",
													height: "38px",
													fontWeight: "600",
												}}
												handleClick={() =>
													navigate({
														pathname: "/new",
													})
												}
											/>
										</div>
									</div>
								) : (
									<>
										<div className="no-saved-properties-container">
											<div className="no-saved-property-content">
												<h3>Your Favorites List is Empty!</h3>
												<div className="saved-property-text">
													<div className="text-content-container">
														<p>
															Start your journey to finding the perfect home by
															adding your favorites.
														</p>
														<span>
															Tap the{" "}
															<b style={{ color: "var(--red)" }}>
																heart icon <HeartOutlined />{" "}
															</b>{" "}
															on any listing to save it here!
														</span>
													</div>

													<button
														className="find-properties-btn"
														onClick={handleDiscoverHomeBtn}
													>
														{" "}
														Discover Your Dream Home{" "}
													</button>
												</div>
											</div>
										</div>
									</>
								)
							) : (
								<div
									className="listing-carousel-dashboard-skeleton"
									style={{
										display: "flex",
									}}
								>
									{Array(6)
										.fill(null)
										.map((_, i) => {
											return <CardSkeleton key={i} />;
										})}
								</div>
							)}
						</div>
					</div>
				</div>
			),
		},
		{
			key: "joinOurTeam",
			label: "Join Our Team",
			children: (
				<>
					<div className="savedPropertiesContent">
						<JoinTeam isUserDetails={!userDetails} />
					</div>
				</>
			),
		},
	];

	return (
		<>
			<div className="wholeViewSavedProperties">
				<div className="savedPropertiesBackgroundComponent">
					<Tabs items={items} onChange={onChange} activeKey={tabOpened} />
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
		</>
	);
};
export default SavedPropertiesComponent;
