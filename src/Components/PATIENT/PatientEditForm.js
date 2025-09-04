"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import styled, { keyframes, css } from "styled-components"
import TestForm from "../FORMS/TestForm"
import { FaTrash, FaSearch, FaPlus, FaUserEdit } from "react-icons/fa"

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

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
}

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
`

// Main Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: ${colors.background};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: ${colors.textPrimary};
`

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
`

// Search Section
const SearchSection = styled.div`
${cardStyles}
  padding: 24px;
`

const SearchTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${colors.primary};
`

const SearchInputGroup = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 576px) {
    flex-direction: column;
  }
`

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
`

// Card Components
const Card = styled.div`
${cardStyles}
`

const CardHeader = styled.div`
  padding: 16px 24px;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: ${colors.white};
  font-weight: 600;
  font-size: 18px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`

const CardBody = styled.div`
  padding: 24px;
`

// Form Components
const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`

const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;
  @media (max-width: 768px) {
    flex-basis: 100%;
  }
`

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${colors.textSecondary};
`

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
  &:disabled, &:read-only {
    background-color: ${colors.light};
    cursor: not-allowed;
  }
`

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
`

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  input {
    margin-right: 8px;
  }
`

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
`

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
`

const SecondaryButton = styled(Button)`
  background: ${colors.white};
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  &:hover {
    background: ${colors.light};
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`

// Table Components
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid ${colors.border};
  }
  th {
    font-weight: 600;
    color: ${colors.textSecondary};
    background-color: ${colors.light};
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover td {
    background-color: rgba(110, 142, 251, 0.05);
  }
`

const ActionIcon = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
    transform: scale(1.1);
  }
`

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
    props.variant === "danger" ? colors.danger : props.variant === "success" ? colors.success : colors.info};
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: inherit;
  }
`

// Dropdown Components
const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px ${colors.shadow};
  z-index: 1000;
  margin-top: 4px;
`

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${colors.light};
  }
`

// Fieldset Component
const Fieldset = styled.fieldset`
${cardStyles}
  border: none;
  padding: 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, ${colors.primary}, ${colors.accent});
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
`

const FieldsetHeader = styled.h4`
  text-align: center;
  padding: 20px 0;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${colors.primary};
  border-bottom: 1px solid ${colors.border};
`

const FieldsetBody = styled.div`
  padding: 24px;
`

// Checkbox Component
const Checkbox = styled.div`
  display: flex;
  align-items: center;
  input {
    margin-right: 8px;
    width: 18px;
    height: 18px;
  }
`

const PatientEditForm = () => {
const getCurrentDateWithTime = () => {
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
const [searchId, setSearchId] = useState("");
const [refByOptions, setRefByOptions] = useState([]);
const [clinicalNames, setClinicalNames] = useState([]);
const [sampleCollectorOptions, setSampleCollectorOptions] = useState([]);
const [title, setTitle] = useState("");
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
testname: [],
payment_method: "",
payment_detail: "",
discount: "",
totalAmount: 0,
partialPayment: { method: "", amount: 0 },
address: {} // Initialize address as an object
    });

// Fetch the latest patient ID when the component is mounted
const fetchRefBy = async () => {
try {
const response = await axios.get(`${Labbaseurl}refby/`)
setRefByOptions(response.data);
        } catch (error) {
console.error('Error fetching patient ID:', error);
        }
    };

useEffect(() => {
fetchRefBy();
    }, []);

// Fetch clinical names on component mount
useEffect(() => {
axios.get(`${Labbaseurl}clinical_name/`)
            .then((response) => {
setClinicalNames(response.data);
            })
            .catch((error) => {
console.error('Error fetching clinical names:', error);
            });
    }, []);

// Fetch the latest patient ID when the component is mounted
const fetchSampleCollector = async () => {
try {
const response = await axios.get(`${Labbaseurl}sample-collector/`)
setSampleCollectorOptions(response.data);
        } catch (error) {
console.error('Error fetching patient ID:', error);
        }
    };

useEffect(() => {
fetchSampleCollector();
    }, []);

const handleSearch = async () => {
try {
const response = await axios.get(`${Labbaseurl}patient/get/${searchId}/`);
const data = response.data;
// console.log(data);

let parsedTests = [];
if (data.testname) {
try {
parsedTests = Array.isArray(data.testname) ? data.testname : JSON.parse(data.testname);
                } catch (err) {
console.error("Error parsing testname:", err);
parsedTests = [];
                }
            }

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
date: getCurrentDateWithTime(),
testname: parsedTests,
payment_method: data.payment_method?.paymentmethod || "",
payment_detail: data.payment_method?.cashdetails || "",
totalAmount: data.totalAmount || 0,
discount: data.discount || 0,
address: { area: parsedArea, pincode: parsedPincode } // Set address
            });
                   
        } catch (error) {
console.error("Error fetching patient data:", error);
setShowAlert({
show: true,
message: "Failed to fetch patient details. Please check the Patient ID.",
variant: "danger"
            });
        }
    };

const [isB2BEnabled, setIsB2BEnabled] = useState(false);
const [showAlert, setShowAlert] = useState({ show: false, message: "", variant: "info" });

const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });

// Hide payment alert when payment method is selected
if (name === "payment_method" && value) {
setShowTestMessage(false);
        }

let updatedGender = formData.gender; // Default to the current gender
if (name === 'Title') {
// Automatically set gender based on title
if (value === 'Mr' || value === 'Master' || value === 'Dr') {
updatedGender = 'Male';
            } else if (value === 'Mrs' || value === 'Ms' || value === 'Miss' || value === 'Baby') {
updatedGender = 'Female';
            } else if (value === 'Baby of') {
updatedGender = 'Other';
            }
        }

// Handle B2B (clinical name) change and map referrerCode and salesMapping
if (name === "B2B" && value) {
const selectedClinical = clinicalNames.find(clinical => clinical.clinicalname === value);
if (selectedClinical) {
setFormData((prevData) => ({
...prevData,
[name]: value,
lab_id: selectedClinical.referrerCode || "",
sales_representative: selectedClinical.salesMapping || "",
...(name === 'Title' && { gender: updatedGender }),
            }));
return;
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
...(name === 'Title' && { gender: updatedGender }),
            }));
        }
    };

const handleInputChange = (field, value) => {
setFormData({ ...formData, [field]: value });
    };

const [testOptions, setTestOptions] = useState([]);
const [filteredOptions, setFilteredOptions] = useState([]);
const [selectedTests, setSelectedTests] = useState([]);
const [showTestForm, setShowTestForm] = useState(false);

// Fetch test details and normalize the keys
useEffect(() => {
axios.get(`${Labbaseurl}test_details/`)
            .then((response) => {
const normalizedData = response.data.map(test => ({
...test,
"test_name": test["test_name"].trim(),
                }));
setTestOptions(normalizedData);
setFilteredOptions(normalizedData);
            })
            .catch((error) => {
console.error('Error fetching test details:', error);
            });
    }, []);

const [formData2, setFormData2] = useState({
testname: '',
amount: '',
collection_container: '',
    });

const [showTestMessage, setShowTestMessage] = useState(false);
const [showPaymentMessage, setShowPaymentMessage] = useState(false);

// Handle selection of a test name from suggestions
const handleOptionClick = (selectedTestDetail) => {
const newTest = {
testname: selectedTestDetail["test_name"],
collection_container: selectedTestDetail["collection_container"],
amount: isB2BEnabled
? Number(selectedTestDetail["L2L_Rate_Card"] || 0)
: Number(selectedTestDetail["MRP"] || 0),
        };

// Check if the test is already in the table
const alreadySelected = formData.testname.some(test => test.testname === newTest.testname);
if (alreadySelected) {
setShowAlert({
show: true,
message: "This test is already selected.",
variant: "warning"
            });
return;
        }

// Update formData with the new test
setFormData((prev) => ({
...prev,
testname: [...prev.testname, newTest],
        }));

// Clear input and suggestions
setFormData2({ testname: "", amount: "", collection_container: "" });
setFilteredOptions([]);
    };

const handleUpdate = async () => {
if (!formData.testname || formData.testname.length === 0) {
setShowTestMessage(true);
return;
        }

if (!formData.payment_method) {
setShowPaymentMessage(true);
return;
        }

try {
// Combine Title and patientname
const fullPatientName = formData.Title ? `${formData.Title} ${formData.patientname}` : formData.patientname;

// Create a new object without the Title field
const { Title, ...formDataWithoutTitle } = formData;

// Convert testname to JSON string and update patientname
const updatedFormData = {
...formDataWithoutTitle, 
patientname: fullPatientName,
testname: JSON.stringify(formData.testname),
            };

// console.log("Sending Data:", updatedFormData);

const response = await axios.put(`${Labbaseurl}patient/update/${formData.patient_id}/`,
updatedFormData
            );

if (response.status === 200) {
setShowAlert({
show: true,
message: "Patient details updated successfully!",
variant: "success"
                });
            } else {
setShowAlert({
show: true,
message: "Failed to update patient details.",
variant: "danger"
                });
            }
        } catch (error) {
console.error("Error updating patient details:", error);
setShowAlert({
show: true,
message: "An error occurred while updating patient details.",
variant: "danger"
            });
        }
    };

const handleTestNameChange = (e) => {
const input = e.target.value.trim();
setFormData2({ ...formData2, testname: input, amount: "", collection_container: "" });

if (input.length >= 1) {
const filtered = testOptions.filter(
                (test) =>
test["test_name"] &&
test["test_name"].toLowerCase().startsWith(input.toLowerCase())
            );
setFilteredOptions(filtered);
        } else {
setFilteredOptions([]);
        }

// Hide test alert when test name is entered
if (input.trim()) {
setShowTestMessage(false);
        }
    };

// Handle deletion of a selected test
const handleDelete = (index) => {
const updatedTests = formData.testname.filter((_, i) => i !== index);
setFormData((prev) => ({
...prev,
testname: updatedTests,
        }));
    };

// Function to calculate the total amount
const calculateTotalAmount = () => {
const total = formData.testname.reduce((sum, test) => sum + Number(test.amount || 0), 0);
let discountedTotal = total;

const discount = formData.discount ? String(formData.discount) : "";

if (discount.trim().endsWith("%")) {
// Percentage-based discount
const percentage = Number.parseFloat(discount.replace("%", "")) || 0;
discountedTotal = total - (total * (percentage / 100));
        } else {
// Fixed amount discount
const fixedDiscount = Number.parseFloat(discount) || 0;
discountedTotal = total - fixedDiscount;
        }

// Ensure total is not negative
discountedTotal = Math.max(0, discountedTotal);

// Update state
setFormData((prev) => ({
...prev,
totalAmount: discountedTotal.toFixed(2),
        }));
    };

// Handle discount value change
const handleDiscountChange = (e) => {
const discountValue = e.target.value;
setFormData((prev) => ({
...prev,
discount: discountValue,
        }));
    };

// Update total amount whenever selected tests or discount changes
useEffect(() => {
calculateTotalAmount();
    }, [formData.testname, formData.discount]);

return (
<Container>
<PageHeader>
<h1><FaUserEdit size={24} /> Patient Edit Form</h1>
</PageHeader>

{showAlert.show && (
<Alert variant={showAlert.variant}>
<span>{showAlert.message}</span>
<button onClick={() => setShowAlert({ ...showAlert, show: false })}>×</button>
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

{/* Lab Details Section */}
<Card>
<CardHeader>Lab Details</CardHeader>
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
<FormInput
type="text"
value={formData.lab_id}
onChange={(e) => handleInputChange("lab_id", e.target.value)}
/>
</FormGroup>
<FormGroup>
<FormLabel>Ref By</FormLabel>
<FormSelect
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
</FormSelect>
</FormGroup>
</FormRow>

<FormRow>
<FormGroup>
<FormLabel>Branch</FormLabel>
<FormInput
type="text"
value={formData.branch}
onChange={(e) => handleInputChange("branch", e.target.value)}
/>
</FormGroup>
<FormGroup>
<FormLabel>Clinical Name</FormLabel>
<FormSelect
name="B2B"
value={formData.B2B}
onChange={handleChange}
>
<option value="">Select Clinical Name</option>
{clinicalNames.map((name, index) => (
<option key={index} value={name.clinicalname}>
{name.clinicalname} ({name.address})
</option>
                                ))}
</FormSelect>
</FormGroup>
<FormGroup>
<FormLabel>Sales Representative</FormLabel>
<FormInput
type="text"
value={formData.sales_representative}
onChange={(e) => handleInputChange("sales_representative", e.target.value)}
/>
</FormGroup>
</FormRow>

<FormRow>
<FormGroup>
<FormLabel>Segment</FormLabel>
<RadioGroup>
<Checkbox>
<input
type="checkbox"
checked={formData.segment === "B2B"}
onChange={() => handleInputChange("segment", "B2B")}
id="b2b-checkbox"
/>
<label htmlFor="b2b-checkbox">B2B</label>
</Checkbox>
<Checkbox>
<input
type="checkbox"
checked={formData.segment === "Home Collection"}
onChange={() => handleInputChange("segment", "Home Collection")}
id="home-collection-checkbox"
/>
<label htmlFor="home-collection-checkbox">Home Collection</label>
</Checkbox>
</RadioGroup>
</FormGroup>
<FormGroup>
<FormLabel>Sample Collector</FormLabel>
<FormSelect
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
</FormSelect>
</FormGroup>
</FormRow>
</CardBody>
</Card>

{/* Personal Details Section */}
<Card>
<CardHeader>Personal Details</CardHeader>
<CardBody>
<FormRow>
<FormGroup>
<FormLabel>Patient ID</FormLabel>
<FormInput
type="text"
value={formData.patient_id}
readOnly
/>
</FormGroup>
<FormGroup>
<FormLabel>Title</FormLabel>
<FormSelect
value={formData.Title}
onChange={(e) => handleInputChange("Title", e.target.value)}
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
value={formData.patientname}
onChange={(e) => handleInputChange("patientname", e.target.value)}
/>
</FormGroup>
</FormRow>

<FormRow>
<FormGroup>
<FormLabel>Age</FormLabel>
<FormInput
type="text"
value={formData.age}
onChange={(e) => handleInputChange("age", e.target.value)}
/>
</FormGroup>
<FormGroup>
<FormLabel>Age Type</FormLabel>
<FormSelect
value={formData.age_type}
onChange={(e) => handleInputChange("age_type", e.target.value)}
>
<option>Year</option>
<option>Month</option>
<option>Day</option>
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
onChange={(e) => handleInputChange("gender", e.target.value)} // Fix the event handler
/>  Male
</RadioLabel>
<RadioLabel>
<input
type="radio"
name="gender"
value="Female"
checked={formData.gender === "Female"}
onChange={(e) => handleInputChange("gender", e.target.value)}
/>                                    Female
</RadioLabel>
<RadioLabel>
<input
type="radio"
name="gender"
value="Other"
checked={formData.gender === "Other"}
onChange={(e) => handleInputChange("gender", e.target.value)}
/>                                    Other
</RadioLabel>
</RadioGroup>
</FormGroup>
</FormRow>
</CardBody>
</Card>

{/* Contact Details Section */}
<Card>
<CardHeader>Contact Details</CardHeader>
<CardBody>
<FormRow>
<FormGroup>
<FormLabel>Phone</FormLabel>
<FormInput
type="text"
value={formData.phone}
onChange={(e) => handleInputChange("phone", e.target.value)}
/>
</FormGroup>
<FormGroup>
<FormLabel>Email</FormLabel>
<FormInput
type="email"
value={formData.email}
onChange={(e) => handleInputChange("email", e.target.value)}
/>
</FormGroup>
</FormRow>
</CardBody>
</Card>

{/* Address Details Section */}
<Card>
<CardHeader>Address Details</CardHeader>
<CardBody>
<FormRow>
<FormGroup>
<FormLabel>Area</FormLabel>
<FormInput
type="text"
value={formData.area}
onChange={(e) => handleInputChange("area", e.target.value)}
/>
</FormGroup>
<FormGroup>
<FormLabel>Pincode</FormLabel>
<FormInput
type="text"
value={formData.pincode}
onChange={(e) => handleInputChange("pincode", e.target.value)}
/>
</FormGroup>
</FormRow>
</CardBody>
</Card>

{/* Test Details Table */}
<Fieldset>
<FieldsetHeader>Billing</FieldsetHeader>
<FieldsetBody>
{showTestMessage && (
<Alert variant="danger">
<span>Please select the test to Generate the Bill.</span>
<button onClick={() => setShowTestMessage(false)}>×</button>
</Alert>
                    )}

{/* Test selection input */}
<FormRow>
<FormGroup style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<FormLabel>Test Name</FormLabel>
<div style={{ display: 'flex', width: '70%', position: 'relative' }}>
<FormInput
type="text"
name="testname"
value={formData2.testname}
onChange={handleTestNameChange}
placeholder="Type Test Name"
/>
<Button style={{ marginLeft: '8px', background: colors.accent,
color: colors.white
                                    }}
onClick={() => setShowTestForm(true)}
>
<FaPlus />
</Button>
<TestForm show={showTestForm} setShow={setShowTestForm} />
</div>

{/* Suggestions Dropdown */}
{formData2.testname.length > 0 && filteredOptions.length > 0 && (
<DropdownContainer style={{ width: '70%' }}>
<DropdownMenu>
{filteredOptions.map((option, index) => (
<DropdownItem
key={index}
onClick={() => handleOptionClick(option)}
>
{option.test_name}
</DropdownItem>
                                        ))}
</DropdownMenu>
</DropdownContainer>
                            )}

{filteredOptions.length === 0 && formData2.testname && (
<div style={{ color: colors.danger, marginTop: '8px' }}>
No test found.
</div>
                            )}
</FormGroup>
</FormRow>

{/* Test Details Table */}
<Card style={{ marginTop: '20px', boxShadow: 'none' }}>
<Table>
<thead>
<tr>
<th>Test Name</th>
<th>Amount</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{formData.testname.length > 0 ? (
formData.testname.map((test, index) => (
<tr key={index}>
<td>{test.testname}</td>
<td>{test.amount}</td>
<td>
<ActionIcon onClick={() => handleDelete(index)}>
<FaTrash color={colors.danger} />
</ActionIcon>
</td>
</tr>
                                    ))
                                ) : (
<tr>
<td colSpan="3" style={{ textAlign: 'center' }}>
No tests available for this patient.
</td>
</tr>
                                )}
</tbody>
</Table>
</Card>

{/* Payment Section */}
{formData.testname.length > 0 && (
<FormRow>
<FormGroup>
<FormLabel>Payment Method</FormLabel>
<FormSelect
name="payment_method"
value={formData.payment_method}
onChange={(e) => {
setFormData({
                                            ...formData,
payment_method: e.target.value,
                                        });
                                    }}
>
<option value="">Select Payment Method</option>
<option value="Cash">Cash</option>
<option value="UPI">UPI</option>
<option value="Credit">Credit</option>
<option value="Neft">Neft</option>
<option value="Cheque">Cheque</option>
<option value="PartialPayment">Partial Payment</option>
</FormSelect>
</FormGroup>

{/* Payment Details Input */}
{formData.payment_method && formData.payment_method !== "Cash" && formData.payment_method !== "PartialPayment" && (
<FormGroup>
<FormLabel>{formData.payment_method} Details</FormLabel>
<FormInput
type="text"
name="payment_detail"
placeholder={`Enter ${formData.payment_method} details`}
value={formData.payment_detail || ""}
onChange={handleChange}
/>
</FormGroup>
                            )}

<FormGroup>
<FormLabel>Discount (%, or Amount)</FormLabel>
<FormInput
type="text"
name="discount"
value={formData.discount}
onChange={handleDiscountChange}
placeholder="Enter discount (e.g., 10% or 50)"
/>
</FormGroup>

<FormGroup>
<FormLabel>Total Amount</FormLabel>
<FormInput
type="text"
name="totalAmount"
value={formData.totalAmount || ""}
readOnly
/>
</FormGroup>
</FormRow>
                    )}

{/* Partial Payment Section */}
{formData.payment_method === "PartialPayment" && (
<>
<FormRow>
<FormGroup>
<FormLabel>Partial Payment Options</FormLabel>
<RadioGroup>
{["Cash", "UPI", "Neft", "Cheque"].map((method) => (
<RadioLabel key={method}>
<input
type="radio"
name="partialPaymentMethod"
value={method}
checked={formData.partialPayment?.method === method}
onChange={(e) =>
setFormData({
                                                            ...formData,
partialPayment: {
                                                                ...formData.partialPayment,
method: e.target.value,
                                                            },
                                                        })
}
/>
{method}
</RadioLabel>
                                        ))}
</RadioGroup>
</FormGroup>
</FormRow>

{formData.partialPayment?.method && (
<FormRow>
<FormGroup>
<FormLabel>{formData.partialPayment.method} Amount</FormLabel>
<FormInput
type="number"
name="partialPaymentAmount"
value={formData.partialPayment.amount || ""}
onChange={(e) =>
setFormData({
                                                    ...formData,
partialPayment: {
                                                        ...formData.partialPayment,
amount: e.target.value,
                                                    },
                                                })
}
/>
</FormGroup>
<FormGroup>
<FormLabel>Remaining Amount</FormLabel>
<FormInput
type="text"
name="remainingAmount"
value={formData.totalAmount - (formData.partialPayment?.amount || 0)}
readOnly
/>
</FormGroup>
</FormRow>
                            )}
</>
                    )}
</FieldsetBody>
</Fieldset>

<div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
<PrimaryButton onClick={handleUpdate}>
                    Update Patient Details
</PrimaryButton>
</div>
</Container>
    );
};

export default PatientEditForm;