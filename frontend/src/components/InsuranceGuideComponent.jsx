import React from "react";
import "../styles/insuranceguide.css";
import InsuranceGuide from "../asset/icons/insuranceguide.png";
import InsuranceHouse from "../asset/icons/insurancehouse.png";
import AutoInsurance from "../asset/icons/autoinsurance.png";
import HealthInsurance from "../asset/icons/healthinsurance.png";
import TravelInsurance from "../asset/icons/travelinsurance.png";
import MainLayout from "./layout/layout.component";
import { useState } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined, CheckCircleOutlined } from "@ant-design/icons";
import CustomMlFooter from "./custom/Custom.Mlfooter";
import FooterComponent from "./layout/FooterComponent";

const InsuranceGuideComponent = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const accordionData = [
    {
      label: 'What are the insurance plans offered by M Lhuillier?',
      answer: 'M Lhuillier offers the following insurance plans...'
    },
    {
      label: 'What are the requirements for insurance plans?',
      answer: 'The requirements for M Lhuillier insurance plans include...'
    },
    {
      label: 'How can I claim the insurance?',
      answer: 'To claim the insurance, you need to...'
    }
  ];
  return (
    <div className="insurance-guide-container">
      <div className="insurance-guide-contents">
        <div className="insurance-guide-content-one">
          <div className="insurance-guide-tagline">
            <span>
              {" "}
              Life your life <br />
              without worry.
            </span>
            <br />
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Secure your home in uncertain
              times.
              <br />
              &nbsp;&nbsp;ML Home Insurance will help you protect
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              and guard your home.
            </p>
          </div>
          <img src={InsuranceGuide}></img>
        </div>
        <div className="insurance-guide-content-two">
          <div className="insurance-guide-inboxes">
            <div className="home-insurance-inbox">
              <img src={InsuranceHouse}></img>
              <span>Home Insurance</span>
              <br />
              <p>
                Protect your home and your loved ones with ML Home Insurance.
              </p>
            </div>
            <div className="auto-insurance-inbox">
              <img src={AutoInsurance}></img>
              <span>Auto Insurance</span>
              <br />
              <p>
                Choose ML Auto Insurance and discover unmatched protection for
                your vehicle.
              </p>
            </div>
            <div className="health-insurance-inbox">
              <img src={HealthInsurance}></img>
              <span>Health Insurance</span>
              <br />
              <p>
                Elevate Your Well-being with ML Health Insurance and be healthy.
              </p>
            </div>
            <div className="travel-insurance-inbox">
              <img src={TravelInsurance}></img>
              <span>Travel Insurance</span>
              <br />
              <p>
                Don't wait until you're sick or injured to think about health
                insurance.
              </p>
            </div>
          </div>
          <div className="insurance-guide-tagline-two">
            <span>
              <b style={{ color: "#ff2800" }}>Choose an Insurance</b> <br />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and let us worry <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; about the rest.
            </span>
            <br />
            <p>We’re here to help. Connect with M Lhuillier today!</p>
          </div>
        </div>
        <div className="insurance-guide-content-three">
          <span>Get Insured Today!</span>
          <br />
          <div className="insurance-guide-content-three-input">
            <input
              type="email"
              placeholder="Enter your email address here"
              style={{ padding: "0px 0px 0px 10px" }}
            />
            <a href="/contact-us">
              <button>Contact Us</button>
            </a>
          </div>
        </div>
        <div className="insurance-guide-content-four">
          <span className="insurance-header">Other ML Insurance Products</span>
          <div className="other-insurance-products">
            <div className="health-insurance-products">
              <span className="insurance-title">Health Insurance</span>
              <div className="insurance-child">
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Dengue Rx Insurance
                </p>
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Emergency Room Insurance
                </p>
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Medicare Plus Insurance
                </p>
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Mediphone Insurance
                </p>
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Personal Accident Insurance
                </p>
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Virtual Medical Assistance
                </p>
              </div>
            </div>
            <div className="travel-insurance-products">
              <span className="insurance-title">Travel Insurance</span>
              <div className="insurance-child">
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;Global Travel Protect Insurance
                </p>
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;OFW Balik Manggagawa Insurance
                </p>
              </div>
            </div>
            <div className="auto-insurance-products">
              <span className="insurance-title">Auto Insurance</span>
              <div className="insurance-child">
                <p>
                  <CheckCircleOutlined />
                  &nbsp;&nbsp;&nbsp;CTPL Insurance
                </p>
                <div className="radio-buttons">
                  <p>Motorcycle</p>
                  <p>Private Car</p>
                  <p>
                    {" "}
                    Commercial Vehicle<br></br>
                    (Light/Medium/Heavy)
                  </p>
                  <p>LTO (MC/Heavy)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="insurance-guide-content-five">
          <span>Frequently Asked Questions</span>
          <div className="questions">
          {accordionData.map((item, index) => (
              <div key={index}>
                <div
                  className="dropdown-label"
                  onClick={() => toggleAccordion(index)}
                  style={{
                    backgroundColor:
                      activeIndex === index ? "#ffffff" : "white",
                    display:activeIndex === index? "flex": "flex",
                    flexDirection:activeIndex === index? "column": "row",
                  }}
                >
                  {item.label}
                  <DownOutlined
                    style={{
                      color: "#ff2800",
                      transform:
                        activeIndex === index ? "rotate(180deg)" : "none",
                      // transition: "transform 0.3s ease",
                    }}
                  />
                  {activeIndex === index && (
                  <div className="dropdown-content" style={{ height: "auto", fontWeight:'lighter' }}>
                    {item.answer}
                  </div>
                )}
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
      <br />
      <br />
      <CustomMlFooter />
      <FooterComponent />
    </div>
  );
};
export default InsuranceGuideComponent;
