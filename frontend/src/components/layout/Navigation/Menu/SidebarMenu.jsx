import { Col, Divider, Menu } from "antd";
import React, { useState, useEffect } from "react";
import { SubMenu } from "../../../../utils/MenuPopover.utils";
import RoundBtn from "../../../custom/buttons/RoundBtn.custom";
import userProfile from "../../../../assets/profile-user.png";
import TextBtn from "../../../custom/buttons/TextBtn.custom";
import { linearProgressClasses } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import JoinTeam from "../../../modals/JoinTeamModal";
import { searchKyc } from "../../../../api/Public/User.api";
import UpgradeTierModal from "../../../modals/UpgradeTierModal";
import { isCookiePresent } from "../../../../utils/CookieChecker";
import { getCookieData } from "../../../../utils/CookieChecker";

const SidebarMenu = ({ setOpenDrawer }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);
	const [currentMenu, setCurrent] = useState("");
	const sessionCookieName = process.env.REACT_APP_SESSION_COOKIE_NAME;
	const accountCookieName = process.env.REACT_APP_ACCOUNT_COOKIE_NAME;
	const isMLWWSPresent = isCookiePresent(sessionCookieName);
	const isAccountDetailsPresent = isCookiePresent(accountCookieName);
	const [userDetails, setUserDetails] = useState(null);

	const accountDetails = getCookieData();

	const openUpgradeModal = () => {
		setShowUpgradeModal(true);
	};
	const closeModal = () => {
		setShowUpgradeModal(false);
	};

	const showLogin = () => {
		const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
		const loginUrl = process.env.REACT_APP_LOGIN_URL;
		setShowUpgradeModal(false);
		window.location.href = `${loginUrl}?redirect_url=${encodeURIComponent(
			redirectUrl
		)}`;
	};
	const handleUserProfileClick = () => {
		const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
		const loginUrl = process.env.REACT_APP_LOGIN_URL;
		if (isMLWWSPresent && isAccountDetailsPresent) {
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
			// window.location.href = `${loginUrl}?redirect_url=${encodeURIComponent(
			// 	redirectUrl
			// )}`;
			setShowUpgradeModal(true);
		}

		// const redirectUrl =
		// 	isCookiePresent(sessionCookieName) && isCookiePresent(accountCookieName)
		// 		? "/listing"
		// 		: process.env.REACT_APP_LOGIN_URL;

		// window.location.href = `${
		// 	process.env.REACT_APP_REDIRECT_URL
		// }?redirect_url=${encodeURIComponent(redirectUrl)}`;
	};
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
	useEffect(() => {
		const path = location.pathname.replace("/", "");

		setCurrent(path);
	}, [setCurrent]);
	const SubMenuChild = (submen) => {
		const m = submen.map((menu, index) => {
			return {
				key: menu.header,
				label: menu.header,
				type: "group",
				children: menu.submenu?.map((sub, key) => {
					// let childSub = sub.childSubMenu;
					return Object.keys(sub).includes("childSubMenu")
						? {
								key: sub.childSubMenu.header,
								label: sub.childSubMenu.header,
								link: sub.link,
								type: "group",
								children: Object.keys(sub).includes("childSubMenu")
									? sub.childSubMenu.submenu.map((i, k) => {
											return {
												key: i.header,
												label: i.sub,
											};
									  })
									: [],
						  }
						: Object.keys(sub).includes("sub_info")
						? {
								key: sub.sub_info,
								label: "Loan Dashboard",
								link: sub.link,
						  }
						: Object.keys(sub).includes("sub_info_insurance")
						? {
								key: sub.sub_info_insurance,
								label: "Begin Your Property Search Today with Our Help!",
								link: sub.link,
						  }
						: {
								key: sub.sub,
								label: sub.sub,
								link: sub.link,
						  };
				}),
			};
		});

		return m;
	};

	const MenuItems = [
		{ label: "New", key: "new", link: "/new" },
		{ label: "Sell", key: "sell", link: "/sell" },
		{
			label: "Buy",
			key: "buy",
			children: SubMenuChild(SubMenu.buy),
			link: "/buy",
		},
		{
			label: "Rent",
			key: "rent",
			children: SubMenuChild(SubMenu.rent),
		},

		{
			label: "Loan",
			key: "home-loan",
			children: SubMenuChild(SubMenu.homeLoan),
		},
		{
			label: "Home Insurance",
			key: "home-insurance",
			link: "/insurance-guide",
		},
		{
			label: "Other Services",
			key: "other-services",
			children: SubMenuChild(SubMenu.otherServices),
		},
		{ label: "Contact", key: "contact", link: "/contact-us" },
	];

	const items = MenuItems.map((item, index) => ({
		key: item.key,
		label: item.label,
		link: item.link,
		children: item.children,
	}));

	const handleMenuOnClick = (menu) => {
		setCurrent(menu.key);
		setOpenDrawer(false);
		const link = menu.item.props.link;
		navigate(link);
	};
	const [showModal, setShowModal] = useState(false);
	const toggleModal = () => {
		setShowModal(!showModal);
	};
	const handleJoinTeamClick = () => {
		setShowModal(true);
		// navigate("/comingsoon");
	};
	return (
		<>
			{showModal && <JoinTeam toggleModal={toggleModal} />}
			<Menu
				style={{
					width: 256,
				}}
				defaultSelectedKeys={["1"]}
				defaultOpenKeys={["sub1"]}
				items={items}
				selectedKeys={[currentMenu]}
				mode="inline"
				className="sidebar-menu"
				onClick={handleMenuOnClick}
			/>

			<Divider />
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gridGap: "10px",
				}}
			>
				<div
					style={{
						gridRow: "1 / 3",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<RoundBtn
						type="primary"
						className="menu-buttons"
						style={{
							background: "#D90000",
						}}
						label="List your Property"
						onClick={handleUserProfileClick}
					/>
					{showUpgradeModal && (
						<UpgradeTierModal
							isVisible={showUpgradeModal}
							onClose={closeModal}
							showLogin={showLogin}
						/>
					)}
					<RoundBtn
						type="primary"
						className="menu-buttons"
						style={{
							border: "#D90000 solid 1px",
							background: "white",
							marginTop: "10px",
							color: "#D90000",
						}}
						label="Join our Team"
						onClick={handleJoinTeamClick}
					/>
				</div>
				<Col
					style={{
						gridRow: "1 / 2",
						alignSelf: "center",
					}}
					align="right"
					className="menu-buttons"
				>
					<img
						src={userProfile}
						style={{ width: "30px", cursor: "pointer", marginTop: "40px" }}
					></img>
				</Col>
			</div>
		</>
	);
};

export default SidebarMenu;
