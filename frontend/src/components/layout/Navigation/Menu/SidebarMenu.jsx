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
import "../../../../styles/sellerdropdown.css";

import TierUpgradeModal from "../../../modals/TierUpgradeModal";
import SellerLogInButtonDropdown from "../../../custom/buttons/SellerLogInButtonDropdown";
import { getCookieData } from "../../../../utils/CookieChecker";
import { useAuth } from "../../../../Context/AuthContext";

const SidebarMenu = ({ setOpenDrawer }) => {
	const { isAuthenticated, logout, userDetails, isSeller } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);
	const [currentMenu, setCurrent] = useState("");
	const sessionCookieName = process.env.REACT_APP_SESSION_COOKIE_NAME;
	const accountCookieName = process.env.REACT_APP_ACCOUNT_COOKIE_NAME;
	const isMLWWSPresent = isCookiePresent(sessionCookieName);
	const isAccountDetailsPresent = isCookiePresent(accountCookieName);
	// const [userDetails, setUserDetails] = useState(null);
	const [tierUpgrade, setTierUpgrade] = useState(false);

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
		navigate('/login/?redirect=saved-properties#listingForm')
	};
		const handleLogout = async () => {
		await logout();
	};
	const handleJoinTeamClick = () => {
		setShowModal(true);
		// navigate("/comingsoon");
	};

	const handleProfileClick = () => {
		if (isAuthenticated && userDetails) {
			window.location.href = "/";
		} else {
			window.location.href = `/login`;
		}
	};
	const openTierUpgradeModal = () => {
		setTierUpgrade(true);
	};

	const handleListPropertyClick = () => {
		if (isAuthenticated && userDetails) {
			if (
				userDetails?.tier?.label !== "BUYER" ||
				userDetails?.tier?.label !== "SEMI-VERIFIED"
			) {
				window.location.href = "/saved-properties#listingForm";
			} else {
				openUpgradeModal();
			}
		} else {
			setShowUpgradeModal(true);
		}
	};

	useEffect(() => {
		const currentPath = location.pathname;

		if (currentPath.includes("/rent")) {
			setCurrent("rent");
		}
		if (currentPath.includes("/new")) {
			setCurrent("new");
		} else if (currentPath.includes("/sale")) {
			setCurrent("buy");
		} else if (currentPath.includes("/discover-home")) {
			setCurrent("home-loan");
		} else if (currentPath.includes("/loan-calculator")) {
			setCurrent("home-loan");
		} else if (currentPath.includes("/refinance")) {
			setCurrent("home-loan");
		} else if (currentPath.includes("/buy-a-home")) {
			setCurrent("home-loan");
		}else if (currentPath.includes("/developers")) {
			setCurrent("developers");
		}
		// else if (currentPath.includes("/pre-selling")) {
		// 	setCurrent("pre-selling");
		// }
		else {
			setCurrent("");
		}
	}, [location.pathname]);

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
						: // : Object.keys(sub).includes("sub_info_insurance")
						  // ? {
						  // 		key: sub.sub_info_insurance,
						  // 		label: "Start Your Property Search Today!",
						  // 		link: sub.link,
						  //   }
						  {
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
			label: "Developers",
			key: "developers",
			children: SubMenuChild(SubMenu.preSelling),
			link: "/developers",
		},
		// {
		// 	label: "Developers",
		// 	key: "pre-selling",
		// 	link: "/pre-selling",
		// },

		// {
		// 	label: "Pre-Selling",
		// 	key: "pre-selling",
		// 	children: SubMenuChild(SubMenu.preSelling),
		// },

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
		// {
		// 	label: "Other Services",
		// 	key: "other-services",
		// 	children: SubMenuChild(SubMenu.otherServices),
		// },
		{ label: "Contact", key: "contact", link: "/contact-us" },
	];

	if (!isAuthenticated) {
		MenuItems.push(
			{
				label: "List Your Property",
				key: "list-property",
				onClick: handleListPropertyClick,
			},
			{
				label: "Join Our Team",
				key: "join-team",
				onClick: handleJoinTeamClick,
			},	
		);
	}else{
		MenuItems.push(
			{
				label: "List Your Property",
				key: "list-property",
				link: "/saved-properties#listingForm",
			},
			{
				label: "Property Listings",
				key: "Property Listings",
				link: "/saved-properties#propertyListings",
			},
			{
				label: "Saved Properties",
				key: "contact",
				link: "/saved-properties#savedProperties",
			},
			{
				label: "Join Our Team",
				key: "join-team",
				link: "/saved-properties#joinOurTeam",
			},
			{
				label: "Logout",
				key: "logout",
				onClick: handleLogout,
			}
		);
	}
	const items = MenuItems.map((item, index) => ({
		key: item.key,
		label: item.label,
		link: item.link,
		children: item.children,
		onClick : item.onClick,
	}));

	const handleMenuOnClick = (menu) => {
		setCurrent(menu.key);
		setOpenDrawer(false);
		const link = menu.item.props.link;
		navigate(link);

		 const clickedItem = items.find((item) => item.key === menu.key);

		if (clickedItem?.onClick) {
			clickedItem.onClick();
			setOpenDrawer(true);
		}
	};
	const [showModal, setShowModal] = useState(false);
	const toggleModal = () => {
		setShowModal(!showModal);
	};

	return (
		<>
			
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
			{showModal && <JoinTeam toggleModal={toggleModal} />}
			<Divider />
			{showUpgradeModal && (
				<UpgradeTierModal
					isVisible={showUpgradeModal}
					onClose={closeModal}
					showLogin={showLogin}
				/>
			)}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					justifyContent: "flex-start",

					// display: "grid",
					// gridTemplateColumns: "1fr 1fr",
					// gridGap: "10px",
				}}
				className="dropdown-user-gr"
			>
				{/* {!isAuthenticated && (
					<div
						style={{
							// gridRow: "1 / 3",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							gap: "10px",
						}}
						className="join-team-list-property"
					>
						<RoundBtn
							type="primary"
							id="list-prop"
							className="menu-buttons"
							style={{
								background: "#D90000",
							}}
							label="List Your Property"
							onClick={handleListPropertyClick}
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
							id="join-team"
							className="menu-buttons"
							style={{
								border: "#D90000 solid 1px",
								background: "white",
								color: "#D90000",
							}}
							label="Join Our Team"
							onClick={handleJoinTeamClick}
						/>
					</div>
				)} */}
				<Col className="menu-buttons">
					{
						// !isAuthenticated ? (
						isAuthenticated && userDetails ? (
							<SellerLogInButtonDropdown />
						) : (
							<button
							className="login-btn-sidemenu"
								// src={userProfile}
								style={{
									
									cursor: "pointer",
									backgroundColor: "rgb(217, 0, 0)",
									color: "white",
									border: "none",
									padding: "8px 10px",
									borderRadius: "5px",
									width: "100%",
									fontSize: "14px !important",
								}}
								onClick={handleProfileClick}
							>
								Login
							</button>
						)
						// ) : (
						// 	<img
						// 		src={userProfile}
						// 		style={{ margin: "0px 0px 0px 10px", cursor: "pointer" }}
						// 		onClick={handleProfileClick}
						// 	/>
						// )
					}
				</Col>
				{tierUpgrade && <TierUpgradeModal openModal={openTierUpgradeModal} />}
			</div>
		</>
	);
};

export default SidebarMenu;
