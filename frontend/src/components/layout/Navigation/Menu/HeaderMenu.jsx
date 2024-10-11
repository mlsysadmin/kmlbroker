import { Button, Menu, Row } from "antd";
import React, { useEffect, useState } from "react";
import MenuPopup from "./MenuPopup";
import MenuPopupContent from "./MenuPopupContent";
import { SubMenu } from "../../../../utils/MenuPopover.utils";
import { useNavigate, useLocation } from "react-router-dom";
import RoundBtn from "../../../custom/buttons/RoundBtn.custom";
import userProfile from "../../../../assets/profile-user.png";

import { getCookieData } from "../../../../utils/CookieChecker";
import { searchKyc } from "../../../../api/Public/User.api";

import JoinTeam from "../../../modals/JoinTeamModal";
import WorkingOnItModal from "../../../ComingSoonComponent";
import PropertySearchModal from "../../../modals/PropertySearchModal";
import { isCookiePresent } from "../../../../utils/CookieChecker";
import UserLogInProfileDropdownBtn from "../../../custom/buttons/BuyerLogInButtonDropdown";
// import userProfileLogIn from "../../../../assets/userProfileLogIn.png"
// import ProfileDropDown
import TextBtn from "../../../custom/buttons/TextBtn.custom";
import LoginModal from "../../../modals/loginmodal";
import SellerLogInButtonDropdown from "../../../custom/buttons/SellerLogInButtonDropdown";
import { colors } from "@mui/material";
import UpgradeTierModal from "../../../modals/UpgradeTierModal";

const HeaderMenu = () => {
	const [currentMenu, setCurrent] = useState("");
	const [rentPopUpOpen, setrentPopUpOpen] = useState(false);
	const [buyPopUpOpen, setbuyPopUpOpen] = useState(false);
	const [homeLoanPopUpOpen, sethomeLoanPopUpOpen] = useState(false);
	const [homeInsurancePopUpOpen, sethomeInsurancePopUpOpen] = useState(false);
	const [otherServicesPopUpOpen, setotherServicesPopUpOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const sessionCookieName = process.env.REACT_APP_SESSION_COOKIE_NAME;
	const accountCookieName = process.env.REACT_APP_ACCOUNT_COOKIE_NAME;
	const isMLWWSPresent = isCookiePresent(sessionCookieName);
	const isAccountDetailsPresent = isCookiePresent(accountCookieName);
	const [userDetails, setUserDetails] = useState(null);

	const login = process.env.REACT_APP_LOGIN_URL;

	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	const closeModal = () => {
		setShowUpgradeModal(false);
	};

	const openUpgradeModal = () => {
		setShowUpgradeModal(true);
	};

	//get user DEtails

	const accountDetails = getCookieData();
	const fetchUserDetails = async () => {
		try {
			const response = await searchKyc(accountDetails.mobileNumber);

			const respData = response.data.data;
			setUserDetails(respData);
		} catch (error) {
			console.error("Error fetching user details:", error);
		}
	};

	useEffect(() => {
		if (isMLWWSPresent && isAccountDetailsPresent) {
			fetchUserDetails();
		}
	}, [isMLWWSPresent, isAccountDetailsPresent]);

	const handleUserProfileClick = () => {
		const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
		const loginUrl = process.env.REACT_APP_LOGIN_URL;
		if (isMLWWSPresent && isAccountDetailsPresent) {
			console.log("cookie", isMLWWSPresent);
			console.log("tier", userDetails.tier.label);
			if (userDetails?.tier?.label === "FULLY VERIFIED") {
				window.location.href = "/listing";
			} else if (userDetails?.tier?.label === "BUYER") {
				console.log(
					"User is a buyer and cannot list properties.",
					showUpgradeModal
				);
				openUpgradeModal();
			}
		} else {
			window.location.href = `${loginUrl}?redirect_url=${encodeURIComponent(
				redirectUrl
			)}`;
		}

		// const redirectUrl =
		// 	isCookiePresent(sessionCookieName) && isCookiePresent(accountCookieName)
		// 		? "/listing"
		// 		: process.env.REACT_APP_LOGIN_URL;

		// window.location.href = `${
		// 	process.env.REACT_APP_REDIRECT_URL
		// }?redirect_url=${encodeURIComponent(redirectUrl)}`;
	};
	//modals
	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => {
		setShowModal(!showModal);
	};
	const handleJoinTeamClick = () => {
		setShowModal(true);
		// navigate("/comingsoon");
	};

	useEffect(() => {
		// const path = location.pathname.replace("/", "");

		// setCurrent(path);
		console.log("path", location);
	}, [location]);

	const handleMenuOnClick = (menu) => {
		if (menu.key === "sell") {
			navigate("/sell");
		} else if (menu.key === "new") {
			navigate("/new");
		} else if (menu.key === "contact") {
			navigate("/contact-us");
		} else if (menu.key === "home-insurance") {
			// setrentPopUpOpen(false);
			// setbuyPopUpOpen(false);
			// sethomeLoanPopUpOpen(false);
			// setotherServicesPopUpOpen(false);
			// sethomeInsurancePopUpOpen(true);
			navigate("/insurance-guide");
		} else if (menu.key === "other-services") {
			setrentPopUpOpen(false);
			setbuyPopUpOpen(false);
			sethomeLoanPopUpOpen(false);
			// sethomeInsurancePopUpOpen(false);
			setotherServicesPopUpOpen(true);
		} else if (menu.key === "rent") {
			setrentPopUpOpen(true);
			setbuyPopUpOpen(false);
			sethomeLoanPopUpOpen(false);
			// sethomeInsurancePopUpOpen(false);
			setotherServicesPopUpOpen(false);
		} else if (menu.key === "buy") {
			setrentPopUpOpen(false);
			setbuyPopUpOpen(true);
			sethomeLoanPopUpOpen(false);
			// sethomeInsurancePopUpOpen(false);
			setotherServicesPopUpOpen(false);
		} else if (menu.key === "home-loan") {
			setrentPopUpOpen(false);
			setbuyPopUpOpen(false);
			sethomeLoanPopUpOpen(true);
			// sethomeInsurancePopUpOpen(false);
			setotherServicesPopUpOpen(false);
		} else {
			navigate({
				pathname: menu.item.props.link,
			});
			setrentPopUpOpen(false);
			setbuyPopUpOpen(false);
			sethomeLoanPopUpOpen(false);
			// sethomeInsurancePopUpOpen(false);
			setotherServicesPopUpOpen(false);
		}
		console.log("menu", menu);

		setCurrent(menu.key);
	};

	const handleMenuHover = (menuKey) => {
		setbuyPopUpOpen(false);
		sethomeLoanPopUpOpen(false);
		// sethomeInsurancePopUpOpen(false);
		setotherServicesPopUpOpen(false);
		setrentPopUpOpen(false);

		if (menuKey === "rent") {
			setrentPopUpOpen(true);
		} else if (menuKey === "buy") {
			setbuyPopUpOpen(true);
		} else if (menuKey === "home-loan") {
			sethomeLoanPopUpOpen(true);
		} else if (menuKey === "home-insurance") {
			sethomeInsurancePopUpOpen(true);
		} else if (menuKey === "other-services") {
			setotherServicesPopUpOpen(true);
		}
	};
	const handleMouseLeave = () => {
		setbuyPopUpOpen(false);
		sethomeLoanPopUpOpen(false);
		// sethomeInsurancePopUpOpen(false);
		setotherServicesPopUpOpen(false);
		setrentPopUpOpen(false);
	};

	const RentMenuPopContent = <MenuPopupContent submenu={SubMenu.rent} />;

	const BuyMenuPopContent = <MenuPopupContent submenu={SubMenu.buy} />;

	const HomeLoanMenuPopContent = (
		<MenuPopupContent submenu={SubMenu.homeLoan} />
	);
	const HomeInsuranceMenuPopContent = (
		<MenuPopupContent submenu={SubMenu.homeInsurance} />
	);
	const OtherServicesMenuPopContent = (
		<MenuPopupContent submenu={SubMenu.otherServices} />
	);
	const RentMenu = () => (
		<MenuPopup
			// handleOpenChange={handleRentOpenChange}
			title={"Looking for your dream rental home?"}
			popUpOpen={rentPopUpOpen}
			label={"Rent"}
			content={RentMenuPopContent}
			menuKey={"rent"}
		/>
	);
	const BuyMenu = () => (
		<MenuPopup
			// handleOpenChange={handleBuyOpenChange}
			title={"Looking for your perfect home?"}
			popUpOpen={buyPopUpOpen}
			label={"Buy"}
			content={BuyMenuPopContent}
			menuKey={"sale"}
		/>
	);

	const HomeLoanMenu = () => (
		<MenuPopup
			// handleOpenChange={handleBuyOpenChange}
			title={""}
			popUpOpen={homeLoanPopUpOpen}
			label={"Loans"}
			content={HomeLoanMenuPopContent}
			menuKey={"home-loan"}
		/>
	);
	// const HomeInsuranceMenu = () => (
	// 	<MenuPopup
	// 		// handleOpenChange={handleBuyOpenChange}
	// 		title={""}
	// 		popUpOpen={homeInsurancePopUpOpen}
	// 		label={"Home Insurance"}
	// 		content={HomeInsuranceMenuPopContent}
	// 		menuKey={'home-insurance'}
	// 	/>
	// );
	const OtherServicesMenu = () => (
		<MenuPopup
			menuKey={"other-services"}
			// handleOpenChange={handleBuyOpenChange}
			title={"Other Services"}
			popUpOpen={otherServicesPopUpOpen}
			label={"Other Services"}
			content={OtherServicesMenuPopContent}
		/>
	);

	const MenuItems = [
		{ label: "New", key: "new", link: "/new" },
		{ label: "Sell", key: "sell", link: "/sell" },
		{ label: <BuyMenu />, key: "buy" },
		{ label: <RentMenu />, key: "rent" },
		{ label: <HomeLoanMenu />, key: "home-loan" },
		{
			// label: <HomeInsuranceMenu />,
			label: "Home Insurance",
			key: "home-insurance",
			link: "/insurance-guide",
		},
		{
			label: <OtherServicesMenu />,
			key: "other-services",
			link: "/other-services",
		},
		{ label: "Contact", key: "contact", link: "/contact-us" },
	];

	const items = MenuItems.map((item, index) => ({
		key: item.key,
		label: item.label,
		link: item.link,
		onMouseEnter: () => handleMenuHover(item.key),
		onMouseLeave: () => handleMenuHover(item.key),
	}));

	return (
		<>
			<div
				style={{
					display: "flex",
					borderBottom: "none",
					alignItems: "center",
					alignContent: "center",
					flexFlow: "wrap",
					flexWrap: "wrap",
				}}
				id="menu-wrapper"
				onMouseLeave={handleMouseLeave}
			>
				<Menu
					mode="horizontal"
					items={items}
					selectedKeys={[currentMenu]}
					onClick={handleMenuOnClick}
					className="header--menu"
				></Menu>
				<RoundBtn
					type="primary"
					className="menu-buttons"
					style={{
						background: "#D90000",
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
						margin: "0px 0px 0px 0px",
					}}
					label="List your Property"
					onClick={handleUserProfileClick}
				/>
				{showUpgradeModal && (
					<UpgradeTierModal isVisible={showUpgradeModal} onClose={closeModal} />
				)}
				{/* {!isMLWWSPresent&&
					( */}
				{!isMLWWSPresent && (
					<RoundBtn
						type="primary"
						className="menu-buttons"
						style={{
							color: "#D90000",
							backgroundColor: "transparent",
							border: "1px solid #d90000",
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							padding: "5px 5px",
							cursor: "pointer",
							margin: "0px 0px 0px 10px",
						}}
						label="Join our Team"
						onClick={handleJoinTeamClick}
					/>
				)}
				{/* )} */}
				{/* {showModal && (
					<WorkingOnItModal isOpen={showModal} onClose={toggleModal} />
				)} */}

				{showModal && <JoinTeam toggleModal={toggleModal} />}
				<Row align={"middle"} className="menu-buttons">
					{isMLWWSPresent ? (
						userDetails?.tier.label === "BUYER" ? (
							<UserLogInProfileDropdownBtn />
						) : userDetails?.tier.label === "FULLY VERIFIED" ? (
							<SellerLogInButtonDropdown />
						) : (
							<></>
						)
					) : (
						<img
							src={userProfile}
							style={{ margin: "0px 0px 0px 10px", cursor: "pointer" }}
							onClick={handleUserProfileClick}
						/>
					)}
				</Row>
			</div>
		</>
	);
};

export default HeaderMenu;
