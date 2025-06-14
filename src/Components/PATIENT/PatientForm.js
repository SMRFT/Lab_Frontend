"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaToggleOff, FaToggleOn, FaSearch } from "react-icons/fa";
import SampleCollectorForm from "../FORMS/SampleCollectorForm";
import ClinicalName from "../FORMS/ClinicalName";
import RefBy from "../FORMS/RefBy";
import styled from "styled-components";
import "./PatientForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Fieldset = styled.fieldset`
  border: 2px dashed #e68fae; /* Dotted border for gradient effect */
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
  background: none; /* No background color */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow */
  font-family: "Poppins", sans-serif;
  color: #1b262c;

  legend {
    font-size: 1.5rem;
    font-weight: bold;
    color: #e68fae; /* Matching the title color */
    padding: 0 10px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-left: 2rem;
    border-radius: 25px;
    border: 1px solid #ced4da;
    font-family: "Poppins", sans-serif;
    font-size: 0.8rem;
    color: #333;

    &::placeholder {
      color: grey; /* Grey color for placeholder */
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #6c757d;
  }
`;
const RequiredIndicator = styled.span`
  color: #ff6b6b;
  margin-left: 0.25rem;
`;

const PatientForm = () => {
  const getCurrentDateWithTime = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Format as YYYY-MM-DD HH:mm:ss
  };
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const storedName = localStorage.getItem("name");

  const [formData, setFormData] = useState({
    patient_id: "",
    date: getCurrentDateWithTime(),
    lab_id: "",
    refby: "",
    branch: "",
    B2B: "",
    segment: "",
    Title: "Mr", // Default Title
    patientname: "",
    gender: "Male", // Default Gender
    age: "",
    age_type: "",
    phone: "",
    email: "",
    address: { area: "", pincode: "" },
    sample_collector: "",
    testname: [],
    totalAmount: 0,
    discount: "",
    payment_method: {},
    credit_amount: "",
    registeredby: storedName,
    bill_no: "",
    salesMapping: "",
    PartialPayment: "",
  });

  const [isHomeCollectionEnabled, setIsHomeCollectionEnabled] = useState(false);
  const [sampleCollectorOptions, setSampleCollectorOptions] = useState([]);
  const [refByOptions, setRefByOptions] = useState([]);
  const [showSampleCollectorForm, setShowSampleCollectorForm] = useState(false);
  const [showRefByForm, setShowRefByFormForm] = useState(false);
  const [showAddOrganisationForm, setShowAddOrganisationForm] = useState(false);
  const [isB2BEnabled, setIsB2BEnabled] = useState(false); // State to track toggle status
  // Add a new state to track form validity
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let updatedGender = formData.gender; // Default to the current gender
    if (name === "Title") {
      // Automatically set gender based on title
      if (value === "Mr" || value === "Master" || value === "Dr") {
        updatedGender = "Male";
      } else if (
        value === "Mrs" ||
        value === "Ms" ||
        value === "Miss" ||
        value === "Baby"
      ) {
        updatedGender = "Female";
      } else if (value === "Baby of") {
        updatedGender = "Other"; // Assume 'other' for BABY OF
      }
    }

    if (name === "area" || name === "pincode") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value, // Update the specific part of address
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "Title" && { gender: updatedGender }), // Update gender only if 'Title' changes
      }));
    }
  };

  const handleClinicalNameSelect = (
    clinicalName,
    referrerCode,
    salesMapping
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      B2B: clinicalName || "", // Update B2B field
      lab_id: referrerCode || "", // Update Lab ID with referrerCode
      salesMapping: salesMapping || "", // Update Sales Mapping
    }));
  };

  const handleToggle = () => {
    setIsB2BEnabled(!isB2BEnabled);

    // Automatically disable home collection when B2B is enabled
    setFormData((prevData) => ({
      ...prevData,
      home_collection: isB2BEnabled ? "" : prevData.home_collection,
    }));

    // If B2B is enabled, disable home collection toggle
    if (!isB2BEnabled) {
      setIsHomeCollectionEnabled(false); // Disable the home collection toggle
    }
  };

  const handleToggleHomeCollection = () => {
    // Only allow toggling if B2B is not enabled
    if (!isB2BEnabled) {
      setIsHomeCollectionEnabled((prev) => !prev);
    } else {
      toast.error("Home Collection cannot be enabled when B2B is active.");
    }
  };

  // Fetch the latest patient ID when the component is mounted
  const fetchSampleCollector = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}sample-collector/`);
      setSampleCollectorOptions(response.data);
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      // Optionally, show an alert or message
    }
  };
  useEffect(() => {
    // Call the fetchPatientId function when the component mounts
    fetchSampleCollector();
  }, []);

  const handleSampleCollectorAdded = () => {
    fetchSampleCollector(); // Refresh RefBy data after adding a new entry
  };

  // Fetch the latest patient ID when the component is mounted
  const fetchPatientId = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}latest-patient-id/`);
      setFormData((prevData) => ({
        ...prevData,
        patient_id: response.data.patient_id, // Set the new patient ID
      }));
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      // Optionally, show an alert or message
    }
  };
  useEffect(() => {
    // Call the fetchPatientId function when the component mounts
    fetchPatientId();
  }, []);

  // Fetch the latest patient ID when the component is mounted
  const fetchRefBy = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}refby/`);
      setRefByOptions(response.data);
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      // Optionally, show an alert or message
    }
  };
  useEffect(() => {
    // Call the fetchPatientId function when the component mounts
    fetchRefBy();
  }, []);

  const handleRefByAdded = () => {
    fetchRefBy(); // Refresh RefBy data after adding a new entry
  };

  // Fetch the latest patient ID when the component is mounted
  const fetchBillNo = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}latest-bill-no/`);
      setFormData((prevData) => ({
        ...prevData,
        bill_no: response.data.bill_no, // Set the fetched bill_no
      }));
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      // Optionally, show an alert or message
    }
  };
  useEffect(() => {
    // Call the fetchPatientId function when the component mounts
    fetchBillNo();
  }, []);

  // Add this useEffect to check form validity whenever patientname or age changes
  useEffect(() => {
    // Check if both patientname and age are filled
    const isValid = formData.patientname.trim() !== "" && formData.age !== "";
    setIsFormValid(isValid);
  }, [formData.patientname, formData.age]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchPatientId();

    // Determine the segment value based on toggle states
    let segmentValue = "Walk-in"; // Default to "Walk-in"
    if (isB2BEnabled) {
      segmentValue = "B2B";
    } else if (isHomeCollectionEnabled) {
      segmentValue = "Home Collection";
    }

    // Validation Logic
    // 1. If B2B is enabled, clinicalName (stored in B2B field) should be mandatory
    if (
      isB2BEnabled &&
      (!formData.refby || !formData.B2B || formData.B2B.trim() === "")
    ) {
      toast.error(" Requred Clinical Name and Referred By ");
      return;
    }

    // 2. If both B2B and Home Collection are not enabled, Referred by is mandatory
    if (
      !isB2BEnabled &&
      !isHomeCollectionEnabled &&
      (!formData.refby || formData.refby.trim() === "")
    ) {
      toast.error("Required Referred by");
      return;
    }

    // 3. Validate contact details if Home Collection is enabled (making them mandatory)
    if (
      isHomeCollectionEnabled &&
      (!formData.refby || !formData.phone || !formData.email)
    ) {
      toast.error("Required Referred By, Phone number and Email ID ");
      return;
    }

    const fullPatientName = `${formData.Title} ${formData.patientname}`;

    // Prepare the address as a JSON object
    const addressData = {
      area: formData.address.area,
      pincode: formData.address.pincode,
    };

    // Set B2B to null if the toggle is not enabled
    const B2BValue = isB2BEnabled ? formData.B2B : null;

    try {
      const response = await axios.post(`${Labbaseurl}patient/create/`, {
        ...formData,
        patientname: fullPatientName,
        segment: segmentValue, // Set the segment dynamically
        age_type: formData.age_type || "Year",
        address: addressData, // Send the address as a JSON object
        B2B: B2BValue, // Include the B2B value dynamically
      });

      // Show success toast
      toast.success("Patient data saved successfully!");

      // Reset form fields
      setFormData({
        patient_id: response.data.patient_id, // Reset patient ID to new value
        date: getCurrentDateWithTime(),
        lab_id: "",
        refby: "",
        branch: "",
        B2B: "",
        segment: "",
        patientname: "",
        gender: "",
        age: "",
        phone: "",
        email: "",
        address: { area: "", pincode: "" },
        age_type: "Year",
        sample_collector: "",
        testname: [],
        totalAmount: 0,
        discount: "",
        payment_method: {},
        credit_amount: "",
        bill_no: "",
        registeredby: storedName,
        salesMapping: "",
        PartialPayment: "",
        clinicalName: "", // Remove this line since clinical name is stored in B2B field
      });

      // Refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      // Show error toast
      toast.error("Error saving data. Please try again.");
    }
  };
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Input value for search
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout reference

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchValue(input);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      if (input.length >= 3) {
        handleSearch(input);
      } else {
        // toast.error("Please type at least 3 characters.");
        setFormData({
          patient_id: "",
          patientname: "",
          age: "",
          gender: "",
          age_type: "year",
          phone: "",
          address: "",
          email: "",
          area: "",
        });
      }
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleSearch = async (value) => {
    try {
      let queryParam;
      const currentDate = getCurrentDateWithTime(); // Get the current date

      // Determine the query parameter based on input value
      if (/^SD\d+$/.test(value)) {
        queryParam = `patient_id=${value}`; // Patient ID
      } else if (/^\d{10}$/.test(value)) {
        queryParam = `phone=${value}`; // Phone number (10 digits)
      } else {
        queryParam = `patientname=${value}`; // Patient name
      }

      // Add the current date as a query parameter
      const response = await axios.get(
        `${Labbaseurl}patient-get/?${queryParam}&date=${currentDate}`
      );
      if (response.data) {
        const prefixes = /^(MR|MRS|MS|MASTER|MISS|DR|BABY|BABY OF)\s+/i;
        const cleanedName = response.data.patientname
          .replace(prefixes, "")
          .trim();

        setFormData((prev) => ({
          ...prev,
          patient_id: response.data.patient_id,
          patientname: cleanedName,
          age: response.data.age,
          age_type: response.data.age_type,
          gender: response.data.gender,
          phone: response.data.phone,
          address: response.data.address,
          email: response.data.email,
        }));

        toast.success("Patient details loaded successfully.");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      // toast.error(error.response?.data?.error || "Error fetching patient details.");
    }
  };

  return (
    <div>
      <form className="container mt-3">
        <h2 className="text-center">Patient Registration Form</h2>

        <div className="row justify-content-center mb-3">
          <div className="col-md-6">
            <SearchContainer>
              <FaSearch />
              <input
                type="text"
                className="form-control"
                placeholder="Enter Patient ID, Name, or Phone"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </SearchContainer>
          </div>
        </div>

        {/* Lab Details */}
        {/* First Row: Date, Lab ID, Ref By, Branch */}
        <Fieldset>
          <h4 style={{ textAlign: "center" }}>Lab Details</h4>
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="text"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Lab ID</label>
              <input
                type="text"
                className="form-control"
                name="lab_id"
                value={formData.lab_id}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Ref By</label>
              <div className="d-flex align-items-center">
                <select
                  className="form-select me-2"
                  name="refby"
                  value={formData.refby}
                  onChange={handleChange}
                >
                  <option value="">Select Refby</option>
                  {refByOptions.map((refby, index) => (
                    <option key={index} value={refby.name}>
                      {refby.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowRefByFormForm(true)}
                >
                  <i className="fa fa-plus"></i> +
                </button>
              </div>
              <RefBy
                show={showRefByForm}
                setShow={setShowRefByFormForm}
                onRefByAdded={handleRefByAdded}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Branch</label>
              <select
                className="form-select"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select a Branch</option>{" "}
                {/* Placeholder option */}
                <option value="Shanmuga Mother Lab">
                  Shanmuga Mother Lab
                </option>{" "}
                {/* Adding Mother Lab option */}
              </select>
            </div>
          </div>
          {/* Second Row: B2B, Home Collection */}
          <div className="row mb-3 align-items-center">
            {/* B2B Toggle */}
            <div className="col-md-2 d-flex flex-column align-items-center">
              <label className="form-label mt-2">B2B</label>
              <div onClick={handleToggle} style={{ cursor: "pointer" }}>
                {isB2BEnabled ? (
                  <FaToggleOn
                    className="ms-2"
                    style={{ fontSize: "40px", color: "green" }}
                  />
                ) : (
                  <FaToggleOff
                    className="ms-2"
                    style={{ fontSize: "40px", color: "grey" }}
                  />
                )}
              </div>
            </div>
            {/* Clinical Name */}
            <div className="col-md-3">
              <ClinicalName
                isB2BEnabled={isB2BEnabled}
                onClinicalNameSelect={handleClinicalNameSelect} // Pass function
              />
            </div>
            {/* Sales Representative */}
            <div className="col-md-2">
              <label className="form-label">Sales Representative</label>
              <input
                type="text"
                className="form-control"
                name="salesMapping"
                value={formData.salesMapping}
                onChange={handleChange}
                readOnly
              />
            </div>
            {/* Home Collection */}
            <div className="col-md-2 d-flex flex-column align-items-center">
              <label className="form-label">Home Collection</label>
              <div
                onClick={handleToggleHomeCollection}
                style={{ cursor: "pointer" }}
              >
                {isHomeCollectionEnabled ? (
                  <FaToggleOn
                    className="ms-2"
                    style={{ fontSize: "40px", color: "green" }}
                  />
                ) : (
                  <FaToggleOff
                    className="ms-2"
                    style={{ fontSize: "40px", color: "grey" }}
                  />
                )}
              </div>
            </div>
            {/* Sample Collector */}
            <div className="col-md-3">
              <label className="form-label">Sample Collector</label>
              <div className="d-flex align-items-center">
                <select
                  className="form-select me-2"
                  name="sample_collector"
                  value={formData.sample_collector}
                  onChange={handleChange}
                >
                  <option value="">Select Sample Collector</option>
                  {sampleCollectorOptions.map((collector, index) => (
                    <option key={index} value={collector.name}>
                      {collector.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowSampleCollectorForm(true)}
                >
                  <i className="fa fa-plus"></i> +
                </button>
              </div>
              <SampleCollectorForm
                show={showSampleCollectorForm}
                setShow={setShowSampleCollectorForm}
                onSampleCollectorAdded={handleSampleCollectorAdded}
              />
            </div>
          </div>
        </Fieldset>

        {/* Third Row: Patient ID, Title, Patient Name, Age, Age Type,gender */}
        <Fieldset>
          <h4 style={{ textAlign: "center" }}>Personal Details</h4>
          <div className="row mb-3">
            {/* Patient ID */}
            <div className="col-md-3">
              <label className="form-label">Patient ID</label>
              <input
                type="text"
                className="form-control"
                name="patient_id"
                value={formData.patient_id}
                readOnly // Make it non-editable
              />
            </div>

            {/* Title */}
            <div className="col-md-2">
              <label className="form-label">Title</label>
              <select
                className="form-select"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
              >
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Master">Master</option>
                <option value="Miss">Miss</option>
                <option value="Dr">Dr</option>
                <option value="Baby">Baby</option>
                <option value="Baby of">Baby of</option>
              </select>
            </div>

            {/* Patient Name */}
            <div className="col-md-3">
              <label className="form-label">
                Patient Name<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="text"
                className="form-control"
                name="patientname"
                value={formData.patientname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">
                Age<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="text"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            {/* Age Type */}
            <div className="col-md-2 mb-4">
              <label className="form-label">Age Type</label>
              <select
                className="form-select"
                name="age_type" // Ensure the name matches formData
                value={formData.age_type}
                onChange={handleChange}
              >
                <option>Year</option>
                <option>Month</option>
                <option>Day</option>
              </select>
            </div>

            {/* Gender radio buttons */}
            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                />{" "}
                Male
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="ms-3"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />{" "}
                Female
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  className="ms-3"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                />{" "}
                Other
              </div>
            </div>
          </div>
        </Fieldset>

        {/* Fourth Row: , Phone Number, Email ID, Address */}
        <Fieldset>
          <h4 style={{ textAlign: "center" }}>Contact Details</h4>
          <div className="row mb-3">
            {/* Phone Number */}
            <div className="col-md-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isB2BEnabled} // Disable when B2B is on
              />
            </div>

            {/* Email ID */}
            <div className="col-md-3">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isB2BEnabled}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Area</label>
              <input
                type="text"
                className="form-control"
                name="area"
                value={formData.address.area} // Access address.area
                onChange={handleChange}
                disabled={isB2BEnabled}
              />
            </div>

            {/* Pin Code Row */}
            <div className="col-md-3">
              <label className="form-label">Pin Code</label>
              <input
                type="text"
                className="form-control"
                name="pincode"
                value={formData.address.pincode} // Access address.pincode
                onChange={handleChange}
                disabled={isB2BEnabled}
              />
            </div>
          </div>
        </Fieldset>
        <div className="d-flex justify-content-center mt-4">
          <button
            className="button mt-3 me-2"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Generate
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default PatientForm;
