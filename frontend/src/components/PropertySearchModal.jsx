import { useState, useEffect, useRef } from "react";
import "../styles/otherservicesSearchPropertyModal.css";
import { SendManualSearch } from "../api/Public/Email.api";
// import "../../styles/otherservicesSearchPropertyModal.css";
import { useNavigate } from "react-router-dom";
import { notification, Select } from "antd";
import CustomMlFooter from "./custom/Custom.Mlfooter";
import FooterComponent from "./layout/FooterComponent";

const PropertySearch = () => {
	const url = window.location.href;
	const urlObj = new URL(url);
	const openModalValue = urlObj?.searchParams.get("dashboardClicked");
	const formRef = useRef(null);
	useEffect(() => {
		if (openModalValue === "true" && formRef.current) {
			formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
	const [formData, setFormData] = useState({
		mobileNumber: "",
		email: "",
		lastName: "",
		firstName: "",
		middleName: "",
		suffix: "",
		propertyType: "",
		propertyDetails: "",
		locationPreference: "",
		budgetRange: "",
		bedroom: "",
		bathroom: "",
		featureAndAmenities: "",
	});
	// useEffect(() => {
	//   if (openModal && formRef.current) {
	//     formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
	//   }
	// }, [openModal]);

	const handleInputChangeInquieries = async (e) => {
		const { name, value } = e.target;
		console.log("Name: ", name, "\nValue:", value);
		if (name === "propertyType") {
			if (value === "Others") {
				setIsOtherSelected(true);
				setFormData((prevFormData) => ({
					...prevFormData,
					propertyType: "",
					propertyDetails: "",
				}));
			} else {
				setIsOtherSelected(false);
				setFormData((prevFormData) => ({
					...prevFormData,
					propertyType: value,
				}));
			}
		} else {
			if (name === "email") {
				// Basic validation to ensure "@" is included
				if (value.includes("@") || value.length === 0) {
					setFormData({ ...formData, [name]: value });
				}
			} else if (name === "mobile_number") {
				// Allow only numbers and limit to 11 characters
				const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
				if (numericValue.length <= 11) {
					setFormData((prevFormData) => ({
						...prevFormData,
						[name]: numericValue,
					}));
				}
			} else {
				setFormData({ ...formData, [name]: value });
			}
			setFormData((prevFormData) => ({
				...prevFormData,
				[name]: value,
			}));
		}
	};

	const [api, contextHolder] = notification.useNotification();

	const openNotificationWithIcon = (type, message, description) => {
		api[type]({
			message: message,
			description: description,
			placement: "bottomRight",
			duration: type == "error" ? 10 : 10,
		});
	};
	const isValidEmail = (email) => {
		// Regular expression for validating an email address
		const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
		if (!emailPattern) {
			return false;
		} else {
			return true;
		}
	};
	const handleKeyDown = (e) => {
		// Regular expression to allow letters and symbols only
		const validInputPattern =
			/^[A-Za-z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

		// Check if the key pressed is valid
		if (
			!validInputPattern.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== "Tab"
		) {
			e.preventDefault(); // Prevent the default action if the key is invalid
		}
	};
	const handleSubmit = async (e) => {
		// setIsSuccessModalVisible(true);
		e.preventDefault();
		console.log("formData inquiery:  ", formData);
		try {
			const manualSearchTriggerPayload = {
				property_type: formData.propertyType,
				property_details: formData.propertyDetails,
				location_preference: formData.locationPreference,
				budget_range: formData.budgetRange,
				no_of_bedrooms: formData.bedroom,
				no_of_bathrooms: formData.bathroom,
				feature_and_amenities: formData.featureAndAmenities,
				mobile_number: formData.mobileNumber,
				email: formData.email,
				last_name: formData.lastName,
				first_name: formData.firstName,
				suffix: formData.suffix,
				middle_name: formData.middleName,
			};
			const manualSearchTrigger = await SendManualSearch(
				manualSearchTriggerPayload
			);
			if (manualSearchTrigger) {
				resetForm();
				openNotificationWithIcon(
					"success",
					`Message Sent`,
					"Thanks for reaching out! Our team will contact you soon with property options."
				);
			} else {
				resetForm();
				openNotificationWithIcon(
					"warning",
					`Invalid Value`,
					"Please provide a valid email address."
				);
			}
		} catch (error) {
			openNotificationWithIcon(
				"error",
				"Message Failed",
				`We're sorry, but your message couldn't be sent. We're already working on resolving the issue. 
        Please try again later, or for immediate assistance, contact us at properties@mlhuillier.com or 380 300, local 11569.
        Thank you for your patience!`
			);
		}
	};

	const [isOtherSelected, setIsOtherSelected] = useState(false);

	const resetForm = () => {
		setFormData({
			mobileNumber: "",
			email: "",
			lastName: "",
			firstName: "",
			middleName: "",
			suffix: "",
			propertyType: "",
			propertyDetails: "",
			locationPreference: "",
			budgetRange: "",
			bedroom: "",
			bathroom: "",
			featureAndAmenities: "",
		});
	};

	const navigate = useNavigate();
	const closeSuccessModal = () => {
		setIsSuccessModalVisible(false);
		navigate("/");
	};
	const isFormValid = () => {
		return (
			Object.values(formData).every((value) => value.trim() !== "") &&
			isValidEmail(formData.email)
		);
	};
	const propertyDetailsOptions = {
		Commercial: ["Service Office", "Shop/Retail", "Commercial Land/Lot"],
		Residential: [
			"Condominium",
			"House & Lot",
			"Lot",
			"Townhouse",
			"Apartment",
		],
		Industrial: ["Warehouse", "Farm Lot", "Hotel/Resort"],
	};
	const availablePropertyDetails = formData.propertyType
		? propertyDetailsOptions[formData.propertyType] || []
		: [];
	return (
		<div className="whole-property-search-page">
			<div className="modal-content-searchprop">
				{contextHolder}
				<div className="toptitle">
					<h3 className="top-title">Looking for Your Dream Property? </h3>
					<span className="top-description">
						Let us help you find the perfect place to call home! Whether you're
						searching for a luxurious estate, commercial lot for your business,
						or industrial lot, our team is dedicated to matching you with the
						ideal property that suits your needs and preferences.
					</span>
				</div>

				<div className="why-choose-us">
					<h3>Why Choose Us?</h3>
					<ul>
						<li>
							Personalized Service: We take the time to understand your unique
							requirements and preferences.
						</li>
						<li>
							Extensive Listings: Access to a wide range of properties, from
							urban centers to serene suburbs.
						</li>
						<li>
							Expert Guidance: Benefit from our experience and knowledge of the
							local real estate market.
						</li>
						<li>
							Streamlined Process: We simplify the search process, saving you
							time and effort.
						</li>
					</ul>
				</div>

				<div className="how-it-works">
					<h3>How it Works?</h3>
					<div className="steps">
						<div className="step">
							<label>Step 1</label>
							<span>Send an Inquiry</span>
							<br />
							<p>
								{" "}
								Fill out the form below with details about your property needs.
							</p>
						</div>
						<div className="step">
							<label>Step 2</label>
							<span>Consultation</span>
							<br />
							<p>
								{" "}
								One of our property experts will contact you for a personalized
								consultation.
							</p>
						</div>
						<div className="step">
							<label>Step 3</label>
							<span>Property Matching</span>
							<br />
							<p>
								{" "}
								We’ll present you with a selection of properties that match your
								criteria.
							</p>
						</div>
						<div className="step">
							<label>Step 4</label>
							<span>Visit & Decide</span>
							<br />
							<p>
								{" "}
								Schedule visits to your favorite properties and decide which
								property you will acquire.
							</p>
						</div>
					</div>
				</div>
				<div className="form-section" ref={formRef}>
					<form className="property-search-form" onSubmit={handleSubmit}>
						<h3>Ready to Start Your Property Search?</h3>
						<p>
							Don’t hesitate to reach out! Our team is eager to assist you in
							finding the perfect property. Simply fill out the inquiry form,
							and we’ll take it from there.
						</p>
						<div className="form-row">
							<div className="form-column">
								<span>Mobile Number</span>
								<input
									type="text"
									name="mobileNumber"
									placeholder="Mobile Number"
									value={formData.mobileNumber}
									onChange={handleInputChangeInquieries}
									maxLength={11}
									onKeyDown={(e) => {
										const currentLength = formData.mobileNumber.length;
										if (e.key === "Backspace" || e.key === "Delete") {
											return;
										}
										if (!/\d/.test(e.key)) {
											e.preventDefault();
										}
										if (currentLength === 0 && e.key !== "0") {
											e.preventDefault();
										}
										if (currentLength === 1 && e.key !== "9") {
											e.preventDefault();
										}
									}}
								/>
							</div>
							<div className="form-column">
								<span>Email Address</span>
								<input
									name="email"
									type="email"
									placeholder="Email Address"
									value={formData.email}
									pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
									onChange={handleInputChangeInquieries}
									// disabled={!!userDetails}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-column">
								<span>Last Name</span>
								<input
									type="text"
									name="lastName"
									placeholder="Last Name"
									value={formData.lastName}
									onKeyDown={handleKeyDown}
									onChange={handleInputChangeInquieries}
									// disabled={!!userDetails}
								/>
							</div>
							<div className="form-column">
								<span>First Name</span>
								<input
									type="text"
									name="firstName"
									placeholder="First Name"
									value={formData.firstName}
									onKeyDown={handleKeyDown}
									onChange={handleInputChangeInquieries}
									// disabled={!!userDetails}
								/>
							</div>
							<div className="form-column">
								<span>Middle Name</span>
								<input
									type="text"
									name="middleName"
									placeholder="Middle Name"
									value={formData.middleName}
									onKeyDown={handleKeyDown}
									onChange={handleInputChangeInquieries}
									// disabled={!!userDetails}
								/>
							</div>
							<div className="form-column">
								<span>Suffix</span>
								<Select
									name="suffix"
									value={formData.suffix}
									onChange={(suffix) =>
										handleInputChangeInquieries({
											target: { name: "suffix", value: suffix },
										})
									}
								>
									<Select.Option value="">Select Suffix</Select.Option>
									<Select.Option value="None">None</Select.Option>
									<Select.Option value="jr">Jr.</Select.Option>
									<Select.Option value="sr">Sr.</Select.Option>
									<Select.Option value="I">I</Select.Option>
									<Select.Option value="II">II</Select.Option>
									<Select.Option value="III">III</Select.Option>
									<Select.Option value="IV">IV</Select.Option>
								</Select>
							</div>
						</div>

						<div className="form-row">
							<div className="form-column">
								<span>Property Type</span>
								{!isOtherSelected ? (
									<Select
										name="propertyType"
										value={formData.propertyType || ""}
										onChange={(propertyType) =>
											handleInputChangeInquieries({
												target: { name: "propertyType", value: propertyType },
											})
										}
										placeholder="Select Property Type"
										allowClear
									>
										<Select.Option value="">Select Property Type</Select.Option>
										<Select.Option value="Commercial">Commercial</Select.Option>
										<Select.Option value="Residential">
											Residential
										</Select.Option>
										<Select.Option value="Industrial">Industrial</Select.Option>
										<Select.Option value="Others">Others</Select.Option>
									</Select>
								) : (
									<input
										type="text"
										name="propertyType"
										placeholder="Specify Other Property Type"
										value={formData.propertyType}
										onChange={(e) => {
											setFormData((prevFormData) => ({
												...prevFormData,
												propertyType: e.target.value,
											}));
										}}
									/>
								)}
							</div>
							<div className="form-column">
								<span>Property Details</span>
								{!isOtherSelected ? (
									<Select
										name="propertyDetails"
										value={formData.propertyDetails}
										onChange={(propertyDetails) =>
											handleInputChangeInquieries({
												target: {
													name: "propertyDetails",
													value: propertyDetails,
												},
											})
										}
									>
										<Select.Option value="">
											Select Property Details
										</Select.Option>
										{availablePropertyDetails.map((detail) => (
											<option key={detail} value={detail}>
												{detail}
											</option>
										))}
									</Select>
								) : (
									<input
										type="text"
										name="propertyDetails"
										placeholder="Specify Other Property Details"
										value={formData.propertyDetails}
										onChange={(e) => {
											setFormData((prevFormData) => ({
												...prevFormData,
												propertyDetails: e.target.value,
											}));
										}}
									/>
								)}
								{/* <select
                  name="propertyDetails"
                  value={formData.propertyDetails}
                  onChange={(e) => handleInputChangeInquieries(e)}
                >
                  <option value="">Select Property Details</option>
                  <option value="Condominium">Condominium</option>
                  <option value="House & Lot">House & Lot</option>
                  <option value="Townhouse">Townhouse</option>
                </select> */}
							</div>
							<div className="form-column">
								<span>Location Preference</span>
								<input
									type="text"
									placeholder="Enter Location"
									name="locationPreference"
									value={formData.locationPreference}
									onKeyDown={handleKeyDown}
									onChange={(e) => handleInputChangeInquieries(e)}
								/>
							</div>
							<div className="form-column">
								<span>Budget Range</span>
								<Select
									name="budgetRange"
									value={formData.budgetRange}
									onChange={(budgetRange) =>
										handleInputChangeInquieries({
											target: { name: "budgetRange", value: budgetRange },
										})
									}
								>
									<Select.Option value="">Select Budget Range</Select.Option>
									<Select.Option value="500K - 1M">500K - 1M</Select.Option>
									<Select.Option value="1M - 3M">1M - 3M</Select.Option>
									<Select.Option value="3M - 8M">3M - 8M</Select.Option>
									<Select.Option value="10M - 15M">10M - 15M</Select.Option>
									<Select.Option value="20M - 30M">20M - 30M</Select.Option>
									<Select.Option value="40M - 50M">40M - 50M</Select.Option>
									<Select.Option value="50M and above">
										50M and above
									</Select.Option>
								</Select>
							</div>
						</div>
						<div className="form-row">
							<div className="left-form-row">
								<div className="form-column">
									<span>Bedrooms</span>
									<input
										type="number"
										placeholder="Enter Number"
										name="bedroom"
										value={formData.bedroom}
										onChange={(e) => handleInputChangeInquieries(e)}
									/>
								</div>
								<div className="form-column">
									<span>Bathrooms</span>
									<input
										type="number"
										placeholder="Enter Number"
										name="bathroom"
										value={formData.bathroom}
										onChange={(e) => handleInputChangeInquieries(e)}
									/>
								</div>
							</div>
							<div className="form-column">
								<span>Feature & Amenities</span>
								<input
									id="featureAmenities"
									type="text"
									placeholder="Enter Feature & Amenities"
									name="featureAndAmenities"
									value={formData.featureAndAmenities}
									onKeyDown={handleKeyDown}
									onChange={(e) => handleInputChangeInquieries(e)}
								/>
							</div>
						</div>
						<div className="form-row submit-row">
							<button
								type="buttom"
								style={{
									backgroundColor: !isFormValid() ? "gray" : "red",
									color: "white",
									cursor: !isFormValid() ? "not-allowed" : "pointer",
								}}
								disabled={!isFormValid()}
							>
								Submit Application
							</button>
						</div>
					</form>
				</div>
			</div>
			<CustomMlFooter />
			<FooterComponent />
		</div>
	);
};

export default PropertySearch;
