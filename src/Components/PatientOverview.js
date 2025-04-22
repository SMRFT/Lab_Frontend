import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import { format } from 'date-fns';
import Modal from 'react-modal';
import JsBarcode from 'jsbarcode';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import 'react-datepicker/dist/react-datepicker.css';
import TestSorting from './TestSorting';
import PatientOverallReport from './PatientOverallReport';
import { Calendar, Search, Printer, Mail, Flag, X, List, user,ChevronDown, Filter, RefreshCw,CreditCard ,MessageCircle} from 'lucide-react';
import { IoIosFemale,IoIosMale,IoMdClose  } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import images
import headerImage from './Images/Header.png';
import FooterImage from './Images/Footer.png';
import Savitha from './Images/Savitha.png';
import Vijayan from './Images/Vijayan.png';

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const FiltersContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.800rem;
  color: var(--gray);
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.800rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const ClearButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);
  
  &:hover {
    background-color: var(--gray-light);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const TableHead = styled.thead`
  background-color: var(--gray-light);
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }
  
  td {
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
  font-style: italic;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.color || 'var(--gray)'};
  color: white;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background-color: ${props => props.disabled ? 'var(--gray-light)' : 'white'};
  color: ${props => props.disabled ? 'var(--gray)' : 'var(--dark)'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
`;

const CreditAmount = styled.span`
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const GenderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${props => props.gender === 'Female' ? 'rgba(232, 62, 140, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  color: ${props => props.gender === 'Female' ? '#E83E8C' : '#007BFF'};
`;

const PrintDropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: green;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background-color: white;
  color: black;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--gray-light);
  }
`;

// Custom modal styles
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000
  },
  content: {
    width: "80%",
    maxWidth: "1000px",
    height: "80%",
    maxHeight: "600px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  }
};

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-light);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--primary-dark);
  margin: 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
`;

const CloseButton = styled(Button)`
  background-color: var(--danger);
  
  &:hover {
    background-color: #d6214f;
  }
`;

const PatientOverview = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [refByOptions, setRefByOptions] = useState([]);
  const [clinicalNames, setClinicalNames] = useState([]);
  const [branch, setBranch] = useState('');
  const [B2B, setB2B] = useState('');
  const [refBy, setRefBy] = useState('');
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const verified_by = localStorage.getItem('name');

  useEffect(() => {
    // Fetch Refby
    axios.get('https://lab.shinovadatabase.in/refby/')
      .then(response => {
        setRefByOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching Refby:', error);
        setError('Failed to load referral options');
      });
  }, []);

  useEffect(() => {
    axios.get('https://lab.shinovadatabase.in/clinical_name/')
      .then((response) => {
        setClinicalNames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching clinical names:', error);
        setError('Failed to load clinical names');
      });
  }, []);

  // Fetch patients when component mounts
  useEffect(() => {
    setLoading(true);
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    axios
      .get(`https://lab.shinovadatabase.in/overall_report/`, {
        params: {
          from_date: formattedStartDate,
          to_date: formattedEndDate,
        },
      })
      .then((response) => {
        setPatients(response.data);
        setFilteredPatients(response.data);
        response.data.forEach(patient => fetchPatientStatus(patient.patient_id));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching filtered patient data:", error);
        setError("Failed to load patient data");
        setLoading(false);
      });
  }, [startDate, endDate]);

  const fetchPatientStatus = (patientIds) => {
    if (!startDate || !endDate || patientIds.length === 0) {
      console.error("Missing parameters:", { patientIds, startDate, endDate });
      return;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    axios
      .get("https://lab.shinovadatabase.in/patient_test_status/", {
        params: {
          from_date: formattedStartDate,
          to_date: formattedEndDate,
          patient_id: patientIds, 
        },
        paramsSerializer: (params) => {
          return Object.keys(params)
            .map((key) =>
              Array.isArray(params[key])
                ? params[key].map(val => `${key}=${encodeURIComponent(val)}`).join("&")
                : `${key}=${encodeURIComponent(params[key])}`
            )
            .join("&");
        }
      })
      .then(response => {
        setStatuses(prevStatuses => ({
          ...prevStatuses,
          ...response.data, 
        }));
      })
      .catch(error => {
        console.error("Error fetching patient status:", error.response?.data || error.message);
      });
  };

  // Determine icon state based on patient status
  const isPrintAndMailEnabled = (status) => status === 'Approved' || status === 'Partially Approved' || status === 'Dispatched';
  const isSortingEnabled = (status) => status === 'Approved' || status === 'Partially Approved' || status === 'Dispatched';
  const isDispatchEnabled = (status) => status === 'Approved';

  // Filter patients based on multiple criteria
useEffect(() => {
  const startOfDay = new Date(startDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);
  const filtered = patients.filter((patient) => {
    const patientDate = new Date(patient.date);
    const patientStatus = statuses[patient.patient_id]?.status || '';
    return (
      patientDate >= startOfDay &&
      patientDate <= endOfDay &&
      (!branch || patient.b2b === branch) &&
      (!B2B || patient.b2b === B2B) &&
      (!refBy || patient.refby === refBy) &&
      (!patientId || patient.patient_id.includes(patientId)) &&
      (!patientName || patient.patient_name?.toLowerCase().includes(patientName.toLowerCase())) &&
      (!statusFilter || patientStatus === statusFilter)
    );
  });
  setFilteredPatients(filtered);
}, [startDate, endDate, patients, branch, B2B, refBy, patientId, patientName, statusFilter, statuses]);
// Update the clearFilters function to reset the status filter
const clearFilters = () => {
  setStartDate(new Date());
  setEndDate(new Date());
  setBranch('');
  setB2B('');
  setRefBy('');
  setPatientId('');
  setPatientName('');
  setStatusFilter('');
  setFilteredPatients(patients);
};

  const handleDispatch = async (patient) => {
    try {
      const response = await axios.patch(
        `https://lab.shinovadatabase.in/update_dispatch_status/${patient.patient_id}/`
      );
  
      if (response.status === 200) {
        alert(`Dispatch updated successfully for Patient: ${patient.patientname}`);
        // Refresh the data
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        
        axios
          .get(`https://lab.shinovadatabase.in/overall_report/`, {
            params: {
              from_date: formattedStartDate,
              to_date: formattedEndDate,
            },
          })
          .then((response) => {
            setPatients(response.data);
            setFilteredPatients(response.data);
          });
      }
    } catch (error) {
      console.error("Error updating dispatch status:", error);
      alert(`Failed to update dispatch status for Patient: ${patient.patientname}`);
    }
  };
  const handleWhatsAppShare = async (patient) => {
    console.log("handleWhatsAppShare called with patient:", patient);

    if (!patient || !patient.phone) {
        toast.error("Patient phone number is missing");
        return;
    }

    // Ensure phone number starts with +91
    let phoneNumber = patient.phone.startsWith("+91") ? patient.phone : `+91${patient.phone}`;
    console.log("Updated Phone Number:", phoneNumber);

    try {
        console.log("Uploading PDF...");

        // **Open a blank tab first (avoids popup blocking)**
        const whatsappWindow = window.open("about:blank", "_blank");

        // Generate the PDF file
        const pdfBlob = await handlePrint(patient, true);
        if (!pdfBlob) {
            toast.error("Failed to generate the PDF");
            return;
        }

        // Prepare FormData for file upload
        const formData = new FormData();
        formData.append(
            "file",
            new File([pdfBlob], `${patient.patient_name || "Patient"}_TestDetails.pdf`, {
                type: "application/pdf",
            })
        );

        // Upload PDF file
        const uploadResponse = await axios.post(
            "https://lab.shinovadatabase.in/upload-pdf/",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Get the uploaded file URL
        const fileUrl = uploadResponse.data.file_url;
        if (!fileUrl) {
            toast.error("File upload failed");
            return;
        }

        // **Formatted WhatsApp Message**
        const labName = "Shanmuga Diagnostic"; // Replace with actual lab name
        const labPhone = "+91 98765 43210"; // Replace with actual lab contact number
        const address = "24, Saratha Clg Rd, Salem, PIN-636007"; // Replace with actual address
        const footerNote = "_For any queries, please contact our lab._"; // Italicized message for support

        const message = encodeURIComponent(
            `🧪 *${labName}* 🏥\n` +
            `📍 *Address:* ${address}\n` +
            `📞 *Contact:* ${labPhone}\n\n` +
            `👤 *Patient Name:* ${patient.patient_name || "N/A"}\n` +
            `🆔 *Patient ID:* ${patient.patient_id || "N/A"}\n\n` +
            `📝 *Test Details:*\n` +
            `📄 Your test report is ready!\n` +
            `🔗 *Download Report:* ${fileUrl}\n\n` +
            `${footerNote}`
        );

        // **Generate the final WhatsApp Web URL**
        const finalWhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        console.log("Opening WhatsApp Web:", finalWhatsAppUrl);

        // **Update the previously opened tab with the WhatsApp Web URL**
        if (whatsappWindow) {
            whatsappWindow.location.href = finalWhatsAppUrl;
        } else {
            window.open(finalWhatsAppUrl, "_blank");
        }

        toast.success("WhatsApp message sent successfully!");
    } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to share via WhatsApp.");
    }
};

  const handleSendEmail = async (patient) => {
    try {
      const pdfBlob = await handlePrint(patient, true); // Generate PDF with letterpad
      if (!pdfBlob) {
        alert("Failed to generate the PDF.");
        return;
      }

      const formData = new FormData();
      formData.append("subject", `Test Details for ${patient.patientname}`);
      formData.append(
        "message",
        `Dear ${patient.patientname || "Recipient"},
      
      We hope this message finds you well. Please find attached the lab test results for ${patient.patientname || "the patient"}. If you have any questions or require further assistance,
      feel free to contact us.
      
      Thank you for choosing our services.`
      );
      
      formData.append("recipients", patient.email); // Assuming patient has an `email` field
      formData.append(
        "attachments",
        new File([pdfBlob], `${patient.patientname}_TestDetails.pdf`, { type: "application/pdf" })
      );

      await axios.post("https://lab.shinovadatabase.in/send-email/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true)

      // Simulated patient data for demo
      const response = await axios.get(
        `https://lab.shinovadatabase.in/get_patient_test_details/?patient_id=${patient.patient_id}`,
      )
      const patientDetails = response.data
      if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
        console.error("No test details found for the patient.")
        return
      }

      // Create a temporary document to calculate content and page count
      const tempDoc = new jsPDF()

      // Function to extract the number from patient_ref_no
      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A"
        const numberPart = refNo.split("+")[0]
        return numberPart
      }

      // Adding Consultant names and qualifications
      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. VIJAYAN Ph.D.", "Consultant Biochemist", Vijayan],
      ]

      const patientRefNo = patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A"
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo)

      // Generate Barcode
      const barcodeCanvas = document.createElement("canvas")
      JsBarcode(barcodeCanvas, patientRefNoNumber, {
        format: "CODE128",
        lineColor: "#000",
        width: 1.5,
        height: 10,
        displayValue: false,
        margin: 0,
      })
      const barcodeImage = barcodeCanvas.toDataURL("image/png")

      // Define consistent margins and dimensions
      const leftMargin = 10
      const rightMargin = 32
      const contentWidth = 190 // A4 width (210mm) minus margins

      const headerHeight = 40 // Height of the header
      const footerHeight = 20 // Height of the footer
      const contentYStart = headerHeight + 10 // Start content below the header
      const signatureHeight = 45 // Height needed for signatures

      // Patient information (left and right sides)
      const leftDetails = [
        { label: "Reg.ID", value: patientDetails.patient_id || "N/A" },
        { label: "Patient Name", value: patientDetails.patientname || "No name provided" },
        { label: "Age/Gender", value: `${patientDetails.age || "N/A"} ${patientDetails.gender || "N/A"}` },
        { label: "Referral", value: patientDetails.refby || "SELF" },
        { label: "Source", value: patientDetails.B2B || "N/A" },
      ]

      const rightDetails = [
        {
          label: "Collected On",
          value: format(new Date(patientDetails.testdetails[0].samplecollected_time), "dd MMM yy/HH:mm") || "N/A",
        },
        {
          label: "Received On",
          value: format(new Date(patientDetails.testdetails[0].received_time), "dd MMM yy/HH:mm") || "N/A",
        },
        { label: "Reported Date", value: format(new Date(), "dd MMM yy/HH:mm") },
        { label: "Patient Ref.No", value: patientRefNoNumber },
      ]

      // Function to calculate max width for alignment
      const calculateMaxLabelWidth = (details) => {
        return Math.max(...details.map((item) => tempDoc.getTextWidth(item.label)))
      }

      // IMPROVED: Calculate total pages with better content height estimation
      const calculateTotalPages = () => {
        const pageHeight = tempDoc.internal.pageSize.height
        const availableHeight = pageHeight - headerHeight - footerHeight - signatureHeight
        let currentYPosition = contentYStart
        let simulatedPageCount = 1

        // Calculate patient details height
        currentYPosition += leftDetails.length * 5 + 10 // Add some padding

        // Calculate height for each test
        if (patientDetails.testdetails.length) {
          // Add table header height
          currentYPosition += 15

          const testsByDepartment = patientDetails.testdetails.reduce((acc, test) => {
            ;(acc[test.department] = acc[test.department] || []).push(test)
            return acc
          }, {})

          Object.keys(testsByDepartment).forEach((department) => {
            // Department title height
            const departmentHeight = 15

            // Check if department header needs a new page
            if (currentYPosition + departmentHeight > pageHeight - (footerHeight + signatureHeight + 20)) {
              simulatedPageCount++
              currentYPosition = contentYStart
            }

            currentYPosition += departmentHeight

            // Tests in this department
            testsByDepartment[department].forEach((test) => {
              // Calculate test height including parameters
              let testHeight = 10 // Base height for the test

              // Add height for test name wrapping
              testHeight += Math.ceil(test.testname?.length / 30) * 5

              // Add height for parameters if they exist
              if (test.parameters && test.parameters.length) {
                test.parameters.forEach((param) => {
                  const paramHeight =
                    Math.max(
                      Math.ceil(param.name?.length / 30) * 5,
                      Math.ceil(param.reference_range?.length / 30) * 5,
                    ) + 8

                  testHeight += paramHeight
                })
              }

              // Check if we need a new page for this test
              if (currentYPosition + testHeight > pageHeight - (footerHeight + signatureHeight + 20)) {
                simulatedPageCount++
                currentYPosition = contentYStart
              }

              currentYPosition += testHeight
            })

            currentYPosition += 10 // Space between departments
          })
        }

        // Add space for end of report and signatures
        if (currentYPosition + 30 > pageHeight - (footerHeight + signatureHeight + 20)) {
          simulatedPageCount++
        }

        return simulatedPageCount
      }

      // Calculate total pages
      const totalPages = calculateTotalPages()

      // Create the actual document
      const doc = new jsPDF()
      let pageCount = 1

      // IMPROVED: Function to add page header and footer with consistent positioning
      const addPageHeaderAndFooter = (pageNum) => {
        // Add header image if 'withLetterpad' is true
        if (withLetterpad) {
          doc.addImage(headerImage, "PNG", leftMargin, 10, contentWidth, 30)
          doc.addImage(FooterImage, "PNG", leftMargin, doc.internal.pageSize.height - footerHeight, contentWidth, 15)
        }

        // Add page number
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.text(`Page ${pageNum} of ${totalPages}`, doc.internal.pageSize.width - 25, 10)
      }

      // IMPROVED: Function to wrap text and return height
      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight) => {
        if (!text) return 0
        const splitText = doc.splitTextToSize(text, maxWidth)
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight)
        })
        return splitText.length * lineHeight
      }

      // IMPROVED: Function to check if we need to add a new page before rendering content
      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height
        const safetyMargin = 10 // Extra margin for safety
        const footerStart = pageHeight - (footerHeight + signatureHeight + safetyMargin)

        // If content is approaching footer, move to a new page
        if (yPos + estimatedHeight >= footerStart) {
          doc.addPage()
          pageCount++
          addPageHeaderAndFooter(pageCount)
          return contentYStart // Reset Y position for new page
        }
        return yPos
      }

      // Function to determine whether a value is high or low compared to reference range
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null

        // Convert value to number if possible
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) return null

        // Handle different reference range formats
        if (reference.includes("-")) {
          const [min, max] = reference.split("-").map((v) => Number.parseFloat(v))
          if (!isNaN(min) && !isNaN(max)) {
            if (numValue < min) return "L"
            if (numValue > max) return "H"
          }
        } else if (reference.includes("<")) {
          const max = Number.parseFloat(reference.replace("<", ""))
          if (!isNaN(max) && numValue > max) return "H"
        } else if (reference.includes(">")) {
          const min = Number.parseFloat(reference.replace(">", ""))
          if (!isNaN(min) && numValue < min) return "L"
        }

        return null
      }

      // IMPROVED: Function to add signatures at the bottom of the last page only
      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height
        const signaturesY = pageHeight - footerHeight - signatureHeight + 10

        // Consultants signatures
        const consultantSpacing = contentWidth / (consultants.length + 1)
        const signatureWidth = 30

        consultants.forEach((consultant, index) => {
          const xPosition = leftMargin + consultantSpacing * (index + 1) - signatureWidth / 2
          // Add Signature (if available)
          if (consultant[2]) {
            doc.addImage(consultant[2], "PNG", xPosition, signaturesY, signatureWidth, 15)
          }
          // Print name below the signature
          doc.setFont("helvetica", "bold")
          doc.setFontSize(8)
          doc.text(consultant[0], xPosition, signaturesY + 20)
          // Print qualification below the name
          doc.setFont("helvetica", "normal")
          doc.setFontSize(7)
          doc.text(consultant[1], xPosition, signaturesY + 25)
        })
      }

      // Start generating the actual PDF
      addPageHeaderAndFooter(pageCount)

      // Better alignment for patient details
      const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails)
      const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails)

      let currentYPosition = contentYStart

      const leftLabelX = leftMargin
      const leftColonX = leftLabelX + leftMaxLabelWidth + 2
      const leftValueX = leftColonX + 3
      const rightLabelX = rightMargin + contentWidth / 2
      const rightColonX = rightLabelX + rightMaxLabelWidth + 2
      const rightValueX = rightColonX + 3

      // Uniform font size for patient details
      doc.setFontSize(9)

      for (let i = 0; i < leftDetails.length; i++) {
        const left = leftDetails[i]
        const right = rightDetails[i]

        // Left Side
        doc.setFont("helvetica", "bold")
        doc.text(left.label, leftLabelX, currentYPosition)
        doc.text(":", leftColonX, currentYPosition)
        doc.setFont("helvetica", "normal")
        doc.text(left.value, leftValueX, currentYPosition)

        if (right) {
          // Right Side
          doc.setFont("helvetica", "bold");
          doc.text(right.label, rightLabelX, currentYPosition);
          doc.text(":", rightColonX, currentYPosition);
          doc.setFont("helvetica", "normal");
          doc.text(right.value, rightValueX, currentYPosition);
          if (right.label === "Patient Ref.No") {
            doc.addImage(barcodeImage, "PNG", rightValueX + doc.getTextWidth(right.value) - 10, currentYPosition + 4, 30, 10);
          }
        }

        currentYPosition += 5 // Reduced spacing between rows
      }

      // IMPROVED: Test rendering logic with better page break handling
      if (patientDetails.testdetails.length) {
        // Column widths adjusted for better layout
        const colWidths = [
          contentWidth * 0.3, // Test Description
          contentWidth * 0.12, // Specimen Type
          contentWidth * 0.08, // Method (Reduced)
          contentWidth * 0.1, // Extra Gap (Added)
          contentWidth * 0.15, // Value(s)
          contentWidth * 0.1, // Unit
          contentWidth * 0.2, // Reference Range
        ]

        // Check if we need a new page for the table header
        currentYPosition = checkForNewPage(currentYPosition, 20)

        let yPos = currentYPosition + 5

        // Draw Top Line
        doc.line(leftMargin, yPos, leftMargin + contentWidth, yPos)
        yPos += 5

        // Table Header
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")

        // Updated headers array to match colWidths
        const headers = ["Test Description", "Specimen", "Method", "", "Value(s)", "Unit", "Reference Range"]

        let xPos = leftMargin

        headers.forEach((header, index) => {
          if (header) {
            // Avoid printing the extra gap column header
            doc.text(header, xPos, yPos)
          }
          xPos += colWidths[index] // Move to the next column
        })

        yPos += 5

        // Draw Bottom Line
        doc.line(leftMargin, yPos, leftMargin + contentWidth, yPos)
        yPos += 5

        // Group Tests by Department
        const testsByDepartment = patientDetails.testdetails.reduce((acc, test) => {
          ;(acc[test.department] = acc[test.department] || []).push(test)
          return acc
        }, {})

        Object.keys(testsByDepartment).forEach((department) => {
          // IMPROVED: Check if we need a new page for the department with better height estimation
          const departmentHeight = 15 // Height for department header
          yPos = checkForNewPage(yPos, departmentHeight)

          // Department Title with Underline
          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          const textWidth = doc.getTextWidth(department.toUpperCase())

          doc.text(department.toUpperCase(), leftMargin + contentWidth / 2, yPos, { align: "center" })
          doc.line(
            leftMargin + contentWidth / 2 - textWidth / 2,
            yPos + 2,
            leftMargin + contentWidth / 2 + textWidth / 2,
            yPos + 2,
          )

          yPos += 10

          // Render each test and its parameters
          testsByDepartment[department].forEach((test) => {
            // Check if parameters exist
            const testsToRender = test.parameters && test.parameters.length > 0 ? [test, ...test.parameters] : [test]

            testsToRender.forEach((currentTest, index) => {
              // IMPROVED: Calculate estimated height more accurately
              const estimatedHeight =
                Math.max(
                  Math.ceil((currentTest.testname || currentTest.name || "").length / 30) * 5,
                  Math.ceil((currentTest.reference_range || "").length / 30) * 5,
                ) + 8

              // IMPROVED: Check if we need a new page with better height estimation
              yPos = checkForNewPage(yPos, estimatedHeight)

              doc.setFontSize(8)
              doc.setFont("helvetica", "normal")

              // Start positions for each column
              let xPos = leftMargin

              // Styling for main test vs parameters
              if (index > 0) {
                doc.setFont("helvetica", "italic")
                doc.setTextColor(100, 100, 100) // Lighter gray for parameters
              }

              // Test Description
              const testNameHeight = wrapText(
                doc,
                index === 0 ? currentTest.testname : `${currentTest.name}`,
                colWidths[0] - 2,
                xPos,
                yPos,
                4,
              )
              xPos += colWidths[0]

              // Specimen Type
              doc.text(currentTest.specimen_type || "", xPos, yPos)
              xPos += colWidths[1]

              // Method
              doc.setFont("helvetica", "italic")
              doc.setTextColor(80, 80, 80) // Dark gray

              // Remove "Method" from the method name
              const displayMethod = (currentTest.method || "").replace(/\bMethod\b/i, "").trim()

              // Display in a single line without wrapping
              doc.text(displayMethod, xPos, yPos)
              doc.setTextColor(0, 0, 0) // Reset to black
              doc.setFont("helvetica", "normal")
              xPos += colWidths[2]

              // Extra Gap
              xPos += colWidths[3]

              // Value(s)
              const statusIndicator = currentTest.isHigh
                ? "H"
                : currentTest.isLow
                  ? "L"
                  : getHighLowStatus(currentTest.value, currentTest.reference_range)

              if (statusIndicator) {
                doc.setFont("helvetica", "bold")
                if (statusIndicator === "H") {
                  doc.setTextColor(255, 0, 0) // Red for high
                } else if (statusIndicator === "L") {
                  doc.setTextColor(0, 0, 255) // Blue for low
                }
                doc.text(`${statusIndicator} ${currentTest.value || ""}`, xPos, yPos)
                doc.setTextColor(0, 0, 0) // Reset to black
              } else {
                doc.text(currentTest.value || "", xPos, yPos)
              }
              xPos += colWidths[4]

              // Unit
              doc.setFont("helvetica", "normal")
              doc.text(currentTest.unit || "", xPos, yPos)
              xPos += colWidths[4]

              // Reference Range
              const referenceRangeHeight = wrapText(
                doc,
                currentTest.reference_range || "",
                colWidths[5] - 2,
                xPos,
                yPos,
                4,
              )

              // Move to next line
              yPos += Math.max(testNameHeight, referenceRangeHeight) + 8

              // Reset styling
              doc.setFont("helvetica", "normal")
              doc.setTextColor(0, 0, 0)
            })

            yPos += 5 // Space between tests
          })

          yPos += 5 // Space between departments
        })

        currentYPosition = yPos
      }

      // IMPROVED: Ensure space for footer and end of report
      const pageHeight = doc.internal.pageSize.height
      const footerStart = pageHeight - (footerHeight + signatureHeight + 30)

      // Function to ensure content doesn't overlap with footer
      const ensureSpaceForFooter = (currentYPosition) => {
        if (currentYPosition >= footerStart) {
          doc.addPage()
          pageCount++
          addPageHeaderAndFooter(pageCount)
          return contentYStart // Reset Y position for new page
        }
        return currentYPosition
      }

      // Use this function before adding final content
      currentYPosition = ensureSpaceForFooter(currentYPosition)

      // End of report
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("**End Of Report**", leftMargin + contentWidth / 2, currentYPosition, { align: "center" })

      // Verification
      const yPosition = currentYPosition + 10
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(`Verified by: Dr. John Smith`, leftMargin, yPosition)

      // Add signatures at the bottom of the last page only
      addSignatures()

      // Generate the PDF as a Blob
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)

      // Open the PDF in a new tab for preview
      window.open(pdfUrl, "_blank")

      setLoading(false)
      return pdfBlob
    } catch (error) {
      console.error("Error while generating the PDF:", error)
      setLoading(false)
      return null
    }
  }

  // Open modal for editing credit amount
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };

  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };

  const showDropdown = (patientId) => {
    setActiveDropdownPatientId(patientId);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
  };
    
  const getBadgeColor = (status) => {
    switch (status) {
      case 'Registered': 
        return '#6C757D'; // Gray for Registered
      case 'Collected': 
        return '#007BFF'; // Blue for Collected
      case 'Partially Collected': 
        return '#FFC107'; // Yellow for Partially Collected
      case 'Received': 
        return '#28A745'; // Green for Received
      case 'Partially Received': 
        return '#17A2B8'; // Teal for Partially Received
      case 'Tested': 
        return '#8A2BE2'; // Purple for Tested
      case 'Partially Tested': 
        return '#FFA500'; // Orange for Partially Tested
      case 'Approved': 
        return '#00C851'; // Bright Green for Approved
      case 'Partially Approved': 
        return '#FFBB33'; // Light Orange for Partially Approved
      case 'Dispatched': 
        return '#808080'; // Grey for Dispatched
      default: 
        return '#6C757D'; // Default Gray
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <Title>Patient Overall Status</Title>
        </CardHeader>
        
        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Branch</FilterLabel>
              <FilterSelect
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">Select a Branch</option>
                <option value="Shanmuga Mother Lab">Shanmuga Mother Lab</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput 
                type="date" 
                value={startDate.toISOString().split("T")[0]} 
                onChange={(e) => setStartDate(new Date(e.target.value))} 
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput 
                type="date" 
                value={endDate.toISOString().split("T")[0]} 
                onChange={(e) => setEndDate(new Date(e.target.value))} 
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Select B2B</FilterLabel>
              <FilterSelect
                value={B2B}
                onChange={(e) => setB2B(e.target.value)}
              >
                <option value="">Select Clinical Name</option>
                {clinicalNames.map((name, index) => (
                  <option key={index} value={name.clinicalname}>
                    {name.clinicalname}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
          
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Select Consulting Doctor</FilterLabel>
              <FilterSelect
                value={refBy}
                onChange={(e) => setRefBy(e.target.value)}
              >
                <option value="">Select Refby</option>
                {refByOptions.map((refby, index) => (
                  <option key={index} value={refby.name}>
                    {refby.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Patient ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Patient Name</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Registered">Registered</option>
                <option value="Collected">Collected</option>
                <option value="Partially Collected">Partially Collected</option>
                <option value="Received">Received</option>
                <option value="Partially Received">Partially Received</option>
                <option value="Tested">Tested</option>
                <option value="Partially Tested">Partially Tested</option>
                <option value="Approved">Approved</option>
                <option value="Partially Approved">Partially Approved</option>
                <option value="Dispatched">Dispatched</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
          
          <ButtonContainer>
            <ClearButton onClick={clearFilters}>
              <X size={16} />
              Clear Filters
            </ClearButton>
            <Button>
              <Filter size={16} />
              Search
            </Button>
          </ButtonContainer>
        </FiltersContainer>
        
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Barcode</th>
                <th>Patient Name</th>
                <th>Referral</th>
                <th>B2B</th>
                <th>Status</th>
                <th>Credit</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map(patient => {
                  const patientStatus = statuses[patient.patient_id] || {};
                  const status = patientStatus.status || 'Loading...';
                  const barcode = patientStatus.barcode || 'N/A';
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const isDispatchEnabledFlag = isDispatchEnabled(status);
                  const isSortingEnabledFlag = isSortingEnabled(status);
                  const badgeColor = getBadgeColor(status);
                  
                  return (
                    <tr key={patient.patient_id}>
                      <td>{patient.date ? format(new Date(patient.date), "yyyy-MM-dd") : 'N/A'}</td>
                      <td>{patient.patient_id}</td>
                      <td>{barcode}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <GenderIcon gender={patient.gender}>
                            {patient.gender === 'Female' ? <IoIosFemale size={14} /> : <IoIosMale size={14} />}
                          </GenderIcon>
                          {patient.patient_name}
                        </div>
                      </td>
                      <td>{patient.refby || 'N/A'}</td>
                      <td>{patient.b2b || 'N/A'}</td>
                      <td>
                        <Badge color={badgeColor}>{status}</Badge>
                      </td>
                      <td>
                        <CreditAmount onClick={() => openModal(patient)}>
                          {patient.credit_amount || '0'}
                        </CreditAmount>
                      </td>
                      <td>
                        <ActionContainer>
                          <ActionButton 
                            onClick={() => openTestModal(patient)} 
                            title="Sort Tests"
                            disabled={!isSortingEnabledFlag}
                          >
                            <List size={16} />
                          </ActionButton>
                          
                          <PrintDropdown
                            onMouseEnter={() => isPrintMailEnabled && showDropdown(patient.patient_id)}
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton disabled={!isPrintMailEnabled} title="Print Options">
                              <Printer size={16} />
                            </ActionButton>

                            {isPrintMailEnabled && (
                              <DropdownMenu isVisible={activeDropdownPatientId === patient.patient_id}>
                                <DropdownItem onClick={() => handlePrint(patient, true)}>
                                  Print with Letterpad
                                </DropdownItem>
                                <DropdownItem onClick={() => handlePrint(patient, false)}>
                                  Print without Letterpad
                                </DropdownItem>
                              </DropdownMenu>
                            )}
                          </PrintDropdown>

                          <ActionButton
                            disabled={!isPrintMailEnabled}
                            onClick={() => isPrintMailEnabled && handleWhatsAppShare(patient)}
                            title="Share via WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </ActionButton>
                          <ActionButton
                            disabled={!isPrintMailEnabled}
                            onClick={() => isPrintMailEnabled && handleSendEmail(patient)}
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </ActionButton>
                          
                          <ActionButton
                            disabled={!isDispatchEnabledFlag}
                            onClick={() => isDispatchEnabledFlag && handleDispatch(patient)}
                            title="Dispatch"
                          >
                            <Flag size={16} />
                          </ActionButton>
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      
      {/* Test Sorting Modal */}
      {isTestModalOpen && (
        <TestSorting 
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)} 
        />
      )}
      
    {/* Credit Amount Modal */}
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "800px",
          height: "fit-content",
          position: "absolute",
          left: "400px", // Adjusted for sidebar width
          right: "auto",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding shadow
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          overflowY:"auto"
        },
      }}
    >
      {/* Close Icon at Top-Right */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          cursor: "pointer",
          fontSize: "20px",
          color: "#333",
        }}
        onClick={closeModal}
      >
       <IoMdClose/>
      </div>
      {/* Pass patient_id and date as props */}
      {selectedPatient && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <PatientOverallReport
            patient_id={selectedPatient.patient_id}
            date={selectedPatient.date}
          />
        </div>
      )}
    </Modal>
    </Container>
  );
};

export default PatientOverview;