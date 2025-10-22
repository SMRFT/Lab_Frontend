"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaToggleOff, FaToggleOn, FaSearch } from "react-icons/fa";
import Select from "react-select"; // Add this import
import SampleCollectorForm from "../FORMS/SampleCollectorForm";
import ClinicalName from "../FORMS/ClinicalName";
import RefBy from "../FORMS/RefBy";
import styled from "styled-components";
import "./PatientForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fieldset = styled.fieldset`
  border: 2px dashed #e68fae;
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
  background: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
  color: #1b262c;
  overflow: visible; /* Ensure fieldset allows overflow */

  legend {
    font-size: 1.5rem;
    font-weight: bold;
    color: #e68fae;
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
      color: grey;
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

// Custom styles for react-select with fixed overflow
const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    flex: 1,
    position: "relative",
    zIndex: 1,
  }),
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
    boxShadow: "none",
    minHeight: "38px",
    width: "100%",
    "&:hover": {
      borderColor: "#e68fae",
    },
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "200px",
    zIndex: 9999,
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid #e68fae",
    borderTop: "none",
    borderRadius: "0 0 0.375rem 0.375rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    marginTop: "-1px",
    overflow: "hidden", // Prevent content overflow
    width: "100%", // Ensure full width
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
    overflowX: "hidden", // Prevent horizontal overflow
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#f8f9fa"
      : "white",
    color: state.isSelected ? "white" : "#333",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "0.875rem",
    whiteSpace: "nowrap", // Prevent text wrapping
    overflow: "hidden", // Hide overflow text
    textOverflow: "ellipsis", // Add ellipsis for long text
    "&:hover": {
      backgroundColor: state.isSelected ? "#007bff" : "#f8f9fa",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "calc(100% - 20px)", // Account for indicators
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6c757d",
    fontSize: "0.875rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "2px 8px",
    overflow: "hidden",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    flexShrink: 0, // Prevent indicators from shrinking
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
};

const PatientForm = () => {
  const getCurrentDateWithTime = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    Title: "Mr.",
    patientname: "",
    gender: "Male",
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
  const [isB2BEnabled, setIsB2BEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Selected values for react-select components
  const [selectedRefBy, setSelectedRefBy] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSampleCollector, setSelectedSampleCollector] = useState(null);

  // Branch options (you can move this to state and fetch from API if needed)
  const branchOptions = [
    { value: "Shanmuga Mother Lab", label: "Shanmuga Mother Lab" },
  ];

  // Convert arrays to react-select format
  const formatRefByOptions = refByOptions.map((refby) => ({
    value: refby.name,
    label: refby.name,
  }));

  const formatSampleCollectorOptions = sampleCollectorOptions.map(
    (collector) => ({
      value: collector.name,
      label: collector.name,
    })
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let updatedGender = formData.gender;
    if (name === "Title") {
      if (value === "Mr." || value === "Master." || value === "Dr.") {
        updatedGender = "Male";
      } else if (
        value === "Mrs." ||
        value === "Ms." ||
        value === "Miss." ||
        value === "Baby."
      ) {
        updatedGender = "Female";
      } else if (value === "Baby of.") {
        updatedGender = "Other";
      }
    }

    if (name === "area" || name === "pincode") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "Title" && { gender: updatedGender }),
      }));
    }
  };

  // Handle react-select changes
  const handleRefByChange = (selectedOption) => {
    setSelectedRefBy(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      refby: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleBranchChange = (selectedOption) => {
    setSelectedBranch(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      branch: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSampleCollectorChange = (selectedOption) => {
    setSelectedSampleCollector(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      sample_collector: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleClinicalNameSelect = (
    clinicalName,
    referrerCode,
    salesMapping,
    phone,
    email
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      B2B: clinicalName || "",
      lab_id: referrerCode || "",
      salesMapping: salesMapping || "",
      phone: phone || "",
      email: email || "",
    }));
  };

  const handleToggle = () => {
    setIsB2BEnabled(!isB2BEnabled);
    setFormData((prevData) => ({
      ...prevData,
      home_collection: isB2BEnabled ? "" : prevData.home_collection,
    }));
    if (!isB2BEnabled) {
      setIsHomeCollectionEnabled(false);
    }
  };

  const handleToggleHomeCollection = () => {
    if (!isB2BEnabled) {
      setIsHomeCollectionEnabled((prev) => !prev);
    } else {
      toast.error("Home Collection cannot be enabled when B2B is active.");
    }
  };

  const fetchSampleCollector = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}sample-collector/`);
      setSampleCollectorOptions(response.data);
    } catch (error) {
      console.error("Error fetching sample collectors:", error);
    }
  };

  useEffect(() => {
    fetchSampleCollector();
  }, []);

  const handleSampleCollectorAdded = () => {
    fetchSampleCollector();
  };

  const fetchPatientId = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}latest-patient-id/`);
      setFormData((prevData) => ({
        ...prevData,
        patient_id: response.data.patient_id,
      }));
    } catch (error) {
      console.error("Error fetching patient ID:", error);
    }
  };

  useEffect(() => {
    fetchPatientId();
  }, []);

  const fetchRefBy = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}refby/`);
      setRefByOptions(response.data);
    } catch (error) {
      console.error("Error fetching refby:", error);
    }
  };

  useEffect(() => {
    fetchRefBy();
  }, []);

  const handleRefByAdded = () => {
    fetchRefBy();
  };

  const fetchBillNo = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}latest-bill-no/`);
      setFormData((prevData) => ({
        ...prevData,
        bill_no: response.data.bill_no,
      }));
    } catch (error) {
      console.error("Error fetching bill number:", error);
    }
  };

  useEffect(() => {
    fetchBillNo();
  }, []);

  useEffect(() => {
    const isValid = formData.patientname.trim() !== "" && formData.age !== "";
    setIsFormValid(isValid);
  }, [formData.patientname, formData.age]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetchPatientId();
      let segmentValue = "Walk-in";
      if (isB2BEnabled) {
        segmentValue = "B2B";
      } else if (isHomeCollectionEnabled) {
        segmentValue = "Home Collection";
      }

      const validateField = (fieldValue, fieldName) => {
        if (
          !fieldValue ||
          (typeof fieldValue === "string" && fieldValue.trim() === "")
        ) {
          toast.error(`${fieldName} is required`);
          return false;
        }
        return true;
      };

      if (isB2BEnabled) {
        if (!validateField(formData.B2B, "Clinical Name")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.refby, "Referred By")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.branch, "Branch")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.sample_collector, "Sample Collector")) {
          setIsSubmitting(false);
          return;
        }
      }

      if (!isB2BEnabled && !isHomeCollectionEnabled) {
        if (!validateField(formData.refby, "Referred By")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.branch, "Branch")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.sample_collector, "Sample Collector")) {
          setIsSubmitting(false);
          return;
        }
      }

      if (isHomeCollectionEnabled) {
        if (!validateField(formData.refby, "Referred By")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.branch, "Branch")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.sample_collector, "Sample Collector")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.phone, "Phone Number")) {
          setIsSubmitting(false);
          return;
        }
        if (!validateField(formData.email, "Email ID")) {
          setIsSubmitting(false);
          return;
        }
      }

      if (!validateField(formData.patientname, "Patient Name")) {
        setIsSubmitting(false);
        return;
      }
      if (!validateField(formData.gender, "Gender")) {
        setIsSubmitting(false);
        return;
      }
      if (!validateField(formData.age, "Age")) {
        setIsSubmitting(false);
        return;
      }

      if (formData.email && formData.email.trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Please enter a valid email address");
          setIsSubmitting(false);
          return;
        }
      }

      if (formData.phone && formData.phone.trim() !== "") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
          toast.error("Please enter a valid 10-digit phone number");
          setIsSubmitting(false);
          return;
        }
      }

      const fullPatientName = `${formData.Title} ${formData.patientname}`;
      const addressData = {
        area: formData.address.area,
        pincode: formData.address.pincode,
      };
      const B2BValue = isB2BEnabled ? formData.B2B : null;

      const response = await axios.post(`${Labbaseurl}patient/create/`, {
        ...formData,
        patientname: fullPatientName,
        segment: segmentValue,
        age_type: formData.age_type || "Year",
        address: addressData,
        B2B: B2BValue,
      });

      toast.success("Patient data saved successfully!");

      // Reset form and selected values
      setFormData({
        patient_id: response.data.patient_id,
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
        clinicalName: "",
      });

      // Reset select components
      setSelectedRefBy(null);
      setSelectedBranch(null);
      setSelectedSampleCollector(null);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Error saving data. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Error saving data. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedTests, setSelectedTests] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

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
      const currentDate = getCurrentDateWithTime();

      if (/^SD\d+$/.test(value)) {
        queryParam = `patient_id=${value}`;
      } else if (/^\d{10}$/.test(value)) {
        queryParam = `phone=${value}`;
      } else {
        queryParam = `patientname=${value}`;
      }

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
    }
  };

  return (
    <div style={{ overflow: "visible" }}>
      <form className="container mt-3" style={{ overflow: "visible" }}>
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
              <div
                className="d-flex align-items-center"
                style={{ position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "8px" }}>
                  <Select
                    options={formatRefByOptions}
                    value={selectedRefBy}
                    onChange={handleRefByChange}
                    isSearchable
                    placeholder="Search Ref By..."
                    styles={customSelectStyles}
                    isClearable
                    menuPortalTarget={document.body}
                  />
                </div>
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
              <div style={{ position: "relative" }}>
                <Select
                  options={branchOptions}
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  isSearchable
                  placeholder="Search Branch..."
                  styles={customSelectStyles}
                  isClearable
                  menuPortalTarget={document.body}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3 align-items-center">
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
            <div className="col-md-3">
              <ClinicalName
                isB2BEnabled={isB2BEnabled}
                onClinicalNameSelect={handleClinicalNameSelect}
              />
            </div>
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
            <div className="col-md-3">
              <label className="form-label">Sample Collector</label>
              <div
                className="d-flex align-items-center"
                style={{ position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "8px" }}>
                  <Select
                    options={formatSampleCollectorOptions}
                    value={selectedSampleCollector}
                    onChange={handleSampleCollectorChange}
                    isSearchable
                    placeholder="Sample Collector..."
                    styles={customSelectStyles}
                    isClearable
                    menuPortalTarget={document.body}
                  />
                </div>
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

        <Fieldset>
          <h4 style={{ textAlign: "center" }}>Personal Details</h4>
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Patient ID</label>
              <input
                type="text"
                className="form-control"
                name="patient_id"
                value={formData.patient_id}
                readOnly
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Title</label>
              <select
                className="form-select"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
              >
                <option value="Mr.">Mr</option>
                <option value="Mrs.">Mrs</option>
                <option value="Ms.">Ms</option>
                <option value="Master.">Master</option>
                <option value="Miss.">Miss</option>
                <option value="Dr.">Dr</option>
                <option value="Baby.">Baby</option>
                <option value="Baby of.">Baby of</option>
              </select>
            </div>

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
            <div className="col-md-2 mb-4">
              <label className="form-label">Age Type</label>
              <select
                className="form-select"
                name="age_type"
                value={formData.age_type}
                onChange={handleChange}
              >
                <option>Year</option>
                <option>Month</option>
                <option>Day</option>
              </select>
            </div>

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

        <Fieldset>
          <h4 style={{ textAlign: "center" }}>Contact Details</h4>
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Area</label>
              <input
                type="text"
                className="form-control"
                name="area"
                value={formData.address.area}
                onChange={handleChange}
                disabled={isB2BEnabled}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Pin Code</label>
              <input
                type="text"
                className="form-control"
                name="pincode"
                value={formData.address.pincode}
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
            disabled={!isFormValid || isSubmitting}
            style={{
              backgroundColor: isSubmitting
                ? "#a777e3"
                : !isFormValid
                ? "#6c757d"
                : "",
              cursor: isSubmitting
                ? "not-allowed"
                : !isFormValid
                ? "not-allowed"
                : "pointer",
              opacity: isSubmitting ? 0.8 : !isFormValid ? 0.6 : 1,
              border: isSubmitting ? "2px solid #a777e3" : "",
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              "Generate"
            )}
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
