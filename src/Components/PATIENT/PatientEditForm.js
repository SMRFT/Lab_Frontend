"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";
import { FaSearch, FaUserEdit } from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Colors
const colors = {
  primary: "#6e8efb",
  secondary: "#a777e3",
  accent: "#e56f8f",
  success: "#4CAF50",
  danger: "#f44336",
  warning: "#ff9800",
  info: "#2196F3",
  light: "#f8f9fa",
  dark: "#343a40",
  white: "#ffffff",
  border: "#dee2e6",
  shadow: "rgba(0, 0, 0, 0.1)",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  background: "#f9fafb",
};

// Shared styles
const cardStyles = css`
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 12px ${colors.shadow};
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  margin-bottom: 24px;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

// Main Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: ${colors.background};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: ${colors.textPrimary};
`;

// Page Header
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: ${colors.primary};
    display: flex;
    align-items: center;

    svg {
      margin-right: 12px;
    }
  }
`;

// Search Section
const SearchSection = styled.div`
  ${cardStyles}
  padding: 24px;
`;

const SearchTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${colors.primary};
`;

const SearchInputGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
  }
`;

// Card Components
const Card = styled.div`
  ${cardStyles}
`;

const CardHeader = styled.div`
  padding: 16px 24px;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: ${colors.white};
  font-weight: 600;
  font-size: 18px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const CardBody = styled.div`
  padding: 24px;
`;

// Form Components
const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    flex-basis: 100%;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${colors.textSecondary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
  }

  &:disabled,
  &:read-only {
    background-color: ${colors.light};
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236c757d' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
  }

  &:disabled,
  &:read-only {
    background-color: ${colors.light};
    cursor: not-allowed;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  input {
    margin-right: 8px;
  }
`;

// Button Components
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: ${colors.white};

  &:hover {
    background: linear-gradient(135deg, ${colors.secondary}, ${colors.primary});
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Alert Component
const Alert = styled.div`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.variant === "danger"
      ? "rgba(244, 67, 54, 0.1)"
      : props.variant === "success"
      ? "rgba(76, 175, 80, 0.1)"
      : "rgba(33, 150, 243, 0.1)"};
  color: ${(props) =>
    props.variant === "danger"
      ? colors.danger
      : props.variant === "success"
      ? colors.success
      : colors.info};

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: inherit;
  }
`;

const PatientEditForm = () => {
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
  const [searchId, setSearchId] = useState("");
  const [refByOptions, setRefByOptions] = useState([]);
  const [clinicalNames, setClinicalNames] = useState([]);
  const [sampleCollectorOptions, setSampleCollectorOptions] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: "",
    patientname: "",
    age: "",
    age_type: "",
    gender: "",
    phone: "",
    email: "",
    area: "",
    pincode: "",
    lab_id: "",
    refby: "",
    branch: "",
    B2B: "",
    sales_representative: "",
    segment: "",
    sample_collector: "",
    date: getCurrentDateWithTime(),
    address: {},
    Title: "",
  });

  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    variant: "info",
  });

  // Fetch reference by options
  const fetchRefBy = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}refby/`);
      setRefByOptions(response.data);
    } catch (error) {
      console.error("Error fetching refby options:", error);
    }
  };

  // Fetch clinical names
  const fetchClinicalNames = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}clinical_name/`);
      setClinicalNames(response.data);
    } catch (error) {
      console.error("Error fetching clinical names:", error);
    }
  };

  // Fetch sample collector options
  const fetchSampleCollector = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}sample-collector/`);
      setSampleCollectorOptions(response.data);
    } catch (error) {
      console.error("Error fetching sample collector options:", error);
    }
  };

  useEffect(() => {
    fetchRefBy();
    fetchClinicalNames();
    fetchSampleCollector();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setShowAlert({
        show: true,
        message: "Please enter a Patient ID to search.",
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.get(`${Labbaseurl}patient/get/${searchId}/`);
      const data = response.data;

      let parsedArea = "";
      let parsedPincode = "";

      if (data.address) {
        parsedArea = data.address.area || "";
        parsedPincode = data.address.pincode || "";
      }

      let Title = "";
      let patientName = data.patientname || "";

      if (patientName) {
        const nameParts = patientName.split(" ");
        Title = nameParts[0];
        patientName = nameParts.slice(1).join(" ");
      }

      setFormData({
        patient_id: data.patient_id || "",
        patientname: patientName,
        Title: Title,
        age: data.age || "",
        age_type: data.age_type || "",
        gender: data.gender || "",
        phone: data.phone || "",
        email: data.email || "",
        lab_id: data.lab_id || "",
        refby: data.refby || "",
        area: parsedArea,
        pincode: parsedPincode,
        branch: data.branch || "",
        B2B: data.B2B || "",
        sales_representative: data.sales_representative || "",
        segment: data.segment || "",
        sample_collector: data.sample_collector || "",
        date: data.date || getCurrentDateWithTime(),
        address: { area: parsedArea, pincode: parsedPincode },
      });

      setShowAlert({
        show: true,
        message: "Patient details loaded successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setShowAlert({
        show: true,
        message:
          "Failed to fetch patient details. Please check the Patient ID.",
        variant: "danger",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedGender = formData.gender;
    if (name === "Title") {
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
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "Title" && { gender: updatedGender }),
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const fullPatientName = formData.Title
        ? `${formData.Title} ${formData.patientname}`
        : formData.patientname;

      const updatedData = {
        patientname: fullPatientName,
        age: parseInt(formData.age), // Convert to number
        age_type: formData.age_type,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: JSON.stringify({
          // Convert to JSON string to match DB format
          area: formData.area,
          pincode: formData.pincode,
        }),
      };

      const response = await axios.put(
        `${Labbaseurl}patient/update/${formData.patient_id}/`,
        updatedData
      );
      if (response.status === 200) {
        setShowAlert({
          show: true,
          message: "Patient details updated successfully!",
          variant: "success",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setShowAlert({
          show: true,
          message: "Failed to update patient details.",
          variant: "danger",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error updating patient details:", error);
      setShowAlert({
        show: true,
        message: "An error occurred while updating patient details.",
        variant: "danger",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Container>
      <PageHeader>
        <h1>
          <FaUserEdit size={24} /> Patient Edit Form
        </h1>
      </PageHeader>

      {showAlert.show && (
        <Alert variant={showAlert.variant}>
          <span>{showAlert.message}</span>
          <button onClick={() => setShowAlert({ ...showAlert, show: false })}>
            ×
          </button>
        </Alert>
      )}

      <SearchSection>
        <SearchTitle>Search Patient Details</SearchTitle>
        <SearchInputGroup>
          <SearchInput
            type="text"
            placeholder="Enter Patient ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <PrimaryButton onClick={handleSearch}>
            <FaSearch /> Search
          </PrimaryButton>
        </SearchInputGroup>
      </SearchSection>

      {/* Lab Details Section - Read Only */}
      {formData.patient_id && (
        <Card>
          <CardHeader>Lab Details (Read Only)</CardHeader>
          <CardBody>
            <FormRow>
              <FormGroup>
                <FormLabel>Date</FormLabel>
                <FormInput
                  type="text"
                  name="date"
                  value={formData.date}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Lab ID</FormLabel>
                <FormInput type="text" value={formData.lab_id} readOnly />
              </FormGroup>
              <FormGroup>
                <FormLabel>Ref By</FormLabel>
                <FormInput type="text" value={formData.refby} readOnly />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Branch</FormLabel>
                <FormInput type="text" value={formData.branch} readOnly />
              </FormGroup>
              <FormGroup>
                <FormLabel>Clinical Name</FormLabel>
                <FormInput type="text" value={formData.B2B} readOnly />
              </FormGroup>
              <FormGroup>
                <FormLabel>Sales Representative</FormLabel>
                <FormInput
                  type="text"
                  value={formData.sales_representative}
                  readOnly
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Segment</FormLabel>
                <FormInput type="text" value={formData.segment} readOnly />
              </FormGroup>
              <FormGroup>
                <FormLabel>Sample Collector</FormLabel>
                <FormInput
                  type="text"
                  value={formData.sample_collector}
                  readOnly
                />
              </FormGroup>
            </FormRow>
          </CardBody>
        </Card>
      )}

      {/* Personal Details Section - Editable */}
      {formData.patient_id && (
        <Card>
          <CardHeader>Personal Details</CardHeader>
          <CardBody>
            <FormRow>
              <FormGroup>
                <FormLabel>Patient ID</FormLabel>
                <FormInput type="text" value={formData.patient_id} readOnly />
              </FormGroup>
              <FormGroup>
                <FormLabel>Title</FormLabel>
                <FormSelect
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
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Patient Name</FormLabel>
                <FormInput
                  type="text"
                  name="patientname"
                  value={formData.patientname}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Age</FormLabel>
                <FormInput
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Age Type</FormLabel>
                <FormSelect
                  name="age_type"
                  value={formData.age_type}
                  onChange={handleChange}
                >
                  <option value="Year">Year</option>
                  <option value="Month">Month</option>
                  <option value="Day">Day</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Gender</FormLabel>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />
                    Male
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    Female
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                    />
                    Other
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>
            </FormRow>
          </CardBody>
        </Card>
      )}

      {/* Contact Details Section - Editable */}
      {formData.patient_id && (
        <Card>
          <CardHeader>Contact Details</CardHeader>
          <CardBody>
            <FormRow>
              <FormGroup>
                <FormLabel>Phone</FormLabel>
                <FormInput
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </CardBody>
        </Card>
      )}

      {/* Address Details Section - Editable */}
      {formData.patient_id && (
        <Card>
          <CardHeader>Address Details</CardHeader>
          <CardBody>
            <FormRow>
              <FormGroup>
                <FormLabel>Area</FormLabel>
                <FormInput
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Pincode</FormLabel>
                <FormInput
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </CardBody>
        </Card>
      )}

      {/* Update Button */}
      {formData.patient_id && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          <PrimaryButton onClick={handleUpdate}>
            Update Patient Details
          </PrimaryButton>
        </div>
      )}
    </Container>
  );
};

export default PatientEditForm;
