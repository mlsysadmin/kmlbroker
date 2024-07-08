import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dummydata from "../../supportDummyData/openListingDummy.json"; // Replace with actual data fetching logic
import "../../styles/SupportListingMasterlist.css";
import Pagination from "./custom.pagination";
import Modal from "./Modal";
import SupportNavigation from "./custom.NavigationComponent";
import FooterComponent from "../layout/FooterComponent";

const PendingListingMasterlist = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuestion, setModalQuestion] = useState("");
  const [remarks, setRemarks] = useState("");
  const [actionType, setActionType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = Dummydata[`${activeTab}_listings`] || [];
        const filtered = listings.filter((listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredListings(filtered);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setFilteredListings([]);
      }
    };

    fetchListings();
  }, [activeTab, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAllChecked(isChecked);
    const updatedFilteredListings = filteredListings.map((listing) => ({
      ...listing,
      selected: isChecked,
    }));
    setFilteredListings(updatedFilteredListings);
  };

  const handleCheckboxChange = (event, listingId) => {
    const isChecked = event.target.checked;
    const updatedFilteredListings = filteredListings.map((listing) =>
      listing.listing_id === listingId
        ? { ...listing, selected: isChecked }
        : listing
    );
    setFilteredListings(updatedFilteredListings);
  };

  const handleEntriesChange = (event) => {
    const value = parseInt(event.target.value);
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowDetails = (listing) => {
    navigate(`/ML-Brokerage/Support/listing-details/${listing.listing_id}`, {
      state: { listing, activeTab },
    });
  };

  const handleApprove = () => {
    setModalQuestion("Are you sure you want to approve the selected listings?");
    setActionType("approve");
    setModalVisible(true);
  };

  const handleDisapprove = () => {
    setModalQuestion(
      "Are you sure you want to disapprove the selected listings?"
    );
    setActionType("disapprove");
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setRemarks("");
  };

  const handleModalConfirm = () => {
    console.log(`${actionType} listings with remarks: ${remarks}`);
    setModalVisible(false);
    setRemarks("");
  };

  const renderListings = (listings) => {
    const indexOfLastItem = currentPage * entriesPerPage;
    const indexOfFirstItem = indexOfLastItem - entriesPerPage;
    const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);

    if (currentListings.length === 0) {
      return (
        <tr>
          <td colSpan="11" className="text-center">
            <center>No results found</center>
          </td>
        </tr>
      );
    }

    return currentListings.map((listing) => (
      <tr key={listing.listing_id}>
        <td>
          <input
            type="checkbox"
            checked={listing.selected || false}
            onChange={(e) => handleCheckboxChange(e, listing.listing_id)}
          />
        </td>
        <td>
          <button
            className="showDetails"
            onClick={() => handleShowDetails(listing)}
          >
            Show Details
          </button>
        </td>
        <td>{listing.date_created}</td>
        <td>{listing.title}</td>
        <td>{listing.property_type}</td>
        <td>{listing.listing_type}</td>
        <td>{listing.floor_area} sqm</td>
        <td>{listing.price}</td>
        <td>{listing.location}</td>
        <td>{listing.status}</td>
      </tr>
    ));
  };

  const tabHeadings = {
    open: "Manage Open Listings",
    pending: "Manage Pending Listings",
    disapproved: "Manage Disapproved Listings",
  };

  const startIndex = (currentPage - 1) * entriesPerPage + 1;
  const endIndex = Math.min(
    startIndex + entriesPerPage - 1,
    filteredListings.length
  );
  const navLinks = [
    {
      text: "Create listing",
      to: "/ML-Brokerage/Support/SupportCreateListingPage",
    },
    {
      text: "Listing Masterlist",
      dropdown: true,
      options: [
        { text: "Open Listings", to: "/ML-Brokerage/Support/open" },
        { text: "Pending Listings", to: "/ML-Brokerage/Support/pending" },
        { text: "Active Listings", to: "/ML-Brokerage/Support/active" },
        {
          text: "Disapproved Listings",
          to: "/ML-Brokerage/Support/disapproved",
        },
      ],
    },
    {
      text: "Application Review",
      dropdown: true,
      options: [
        {
          text: "Open Applications",
          to: "/ML-Brokerage/Support/openApplication",
        },
        {
          text: "Pending Applications",
          to: "/ML-Brokerage/Support/pendingApplication",
        },
        {
          text: "Denied Applications",
          to: "/dashboard/Support/disapprovedApplication",
        },
        {
          text: "Canceled Applications",
          to: "/dashboard/Support/CanceledApplications ",
        },
        {
          text: "Closed Applications ",
          to: "/dashboard/Support/ClosedApplications  ",
        },
      ],
    },
    { text: "Client Management", to: "/ML-Brokerage/Support/SupportDashboard" },
  ];

  return (
    <>
      <SupportNavigation navLinkProps={navLinks} />
      <div className="listings-container">
        <h1>{tabHeadings[activeTab]}</h1>
        <hr style={{ border: "#D90000 solid 1px", width: "100%" }} />
        <br />
        <div className="controls">
          <div className="entries">
            <label>Show Entries</label>
            <select value={entriesPerPage} onChange={handleEntriesChange}>
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div className="searchbar">
            <input
              placeholder="Search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th>Select</th>
                <th>Date Created</th>
                <th>Title</th>
                <th>Property Type</th>
                <th>Listing Type</th>
                <th>Floor Area</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{renderListings(filteredListings)}</tbody>
          </table>
        </div>
        <div className="btns">
          {activeTab !== "disapproved" && (
            <div className="actions">
              <button id="approve" onClick={handleApprove}>
                Approve
              </button>
              <button id="disapprove" onClick={handleDisapprove}>
                Disapprove
              </button>
            </div>
          )}
          <Pagination
            totalItems={filteredListings.length}
            itemsPerPage={entriesPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
        <div className="entries-summary">
          Showing {startIndex} to {endIndex} of {filteredListings.length}{" "}
          entries
        </div>
        <FooterComponent />
        <Modal
          show={modalVisible}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          question={`Are you sure you want to ${actionType} the selected listings?`}
          remarks={remarks}
          setRemarks={setRemarks}
          actionType={actionType}
        />
      </div>
    </>
  );
};

export default PendingListingMasterlist;
