import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';
import jsPDF from "jspdf";
import "jspdf-autotable";
const Invoice = () => {
 const [patients, setPatients] = useState([]);
 const [filteredPatients, setFilteredPatients] = useState([]);
 const [b2bNames, setB2bNames] = useState([]);
 const [selectedB2b, setSelectedB2b] = useState("");
 const [overallTotalAmount, setOverallTotalAmount] = useState(0);
 const [totalCreditAmount, setTotalCreditAmount] = useState(0);
 const [startDate, setStartDate] = useState(null);
 const [endDate, setEndDate] = useState(null);
 const [showCreditOnly, setShowCreditOnly] = useState(false);
 const [creditAmounts, setCreditAmounts] = useState({});
 const [editMode, setEditMode] = useState({});
 const [expandDetails, setExpandDetails] = useState({});
 const [selectedPatientIds, setSelectedPatientIds] = useState([]); // Track selected patients
 const [selectAll, setSelectAll] = useState(false); // Track "Select All" status

 useEffect(() => {
 axios.get('https://lab.shinovadatabase.in/all-patients/')
 .then(response => {
 const data = response.data;
 setPatients(data);
 setFilteredPatients(data);
 const uniqueB2bNames = [...new Set(data.map(patient => patient.B2B))];
 setB2bNames(uniqueB2bNames);
 })
 .catch(error => console.error("Error fetching data:", error));
 }, []);

 useEffect(() => {
 const totalAmount = filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.totalAmount) || 0), 0);
 const creditAmount = filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.credit_amount) || 0), 0);
 setOverallTotalAmount(totalAmount);
 setTotalCreditAmount(creditAmount);
 }, [filteredPatients]);

 const filterPatients = (b2bName, start, end, creditOnly) => {
 let filtered = patients;
 if (b2bName) {
 filtered = filtered.filter(patient => patient.B2B === b2bName);
 }
 if (start && end) {
 filtered = filtered.filter(patient => {
 const patientDate = new Date(patient.date);
 return patientDate >= start && patientDate <= end;
 });
 }
 if (creditOnly) {
 filtered = filtered.filter(patient => parseFloat(patient.credit_amount) > 0);
 }
 setFilteredPatients(filtered);
 };

 const toggleEditMode = (patientId) => {
 setEditMode(prev => ({ ...prev, [patientId]: !prev[patientId] }));
 };

 const toggleExpandDetails = (index) => {
 setExpandDetails(prev => ({ ...prev, [index]: !prev[index] }));
 };

 const handleB2bChange = (event) => {
 const b2bName = event.target.value;
 setSelectedB2b(b2bName);
 filterPatients(b2bName, startDate, endDate, showCreditOnly);
 };

 const handleDateChange = (dates) => {
 const [start, end] = dates;
 setStartDate(start);
 setEndDate(end);
 filterPatients(selectedB2b, start, end, showCreditOnly);
 };

 const handleCreditToggle = (event) => {
 const creditOnly = event.target.checked;
 setShowCreditOnly(creditOnly);
 filterPatients(selectedB2b, startDate, endDate, creditOnly);
 };

 const handleCreditAmountChange = (patientId, value) => {
 const newValue = value >= 0 ? value : '';
 setCreditAmounts(prev => ({ ...prev, [patientId]: newValue }));
 };
 const [b2bCreditAmount, setB2bCreditAmount] = useState(0);
 const handleB2bCreditAmountChange = (event) => {
 setB2bCreditAmount(parseFloat(event.target.value) || 0);
 };

 const handleB2bCreditAmountSave = () => {
 if (b2bCreditAmount >= 0 && selectedB2b) {
 const b2bPatients = filteredPatients.filter(patient => patient.B2B === selectedB2b);
 
 if (b2bPatients.length > 0) {
 // Calculate the equal share of the credit amount per patient
 const equalCreditAmount = (b2bCreditAmount / b2bPatients.length).toFixed(2);
 
 // Update each patient's credit amount directly to equalCreditAmount
 Promise.all(b2bPatients.map(patient => 
 axios.patch(`https://lab.shinovadatabase.in/update-credit/${patient.patient_id}/`, {
 credit_amount: equalCreditAmount,
 tests: patient.testname.map(test => ({
 ...test,
 credit_amount: (equalCreditAmount / patient.testname.length).toFixed(2),
 })),
 })
 ))
 .then(responses => {
 // Update state after saving
 const updatedPatients = filteredPatients.map(patient =>
 patient.B2B === selectedB2b
 ? { ...patient, credit_amount: equalCreditAmount }
 : patient
 );
 setFilteredPatients(updatedPatients);
 
 // Recalculate total credit amount for display or further processing
 const updatedTotalCreditAmount = updatedPatients.reduce((sum, patient) => {
 return sum + (parseFloat(patient.credit_amount) || 0);
 }, 0);
 setTotalCreditAmount(updatedTotalCreditAmount);
 alert("Credit amounts updated successfully!");
 })
 .catch(error => {
 console.error("Error updating credit amounts:", error.response ? error.response.data : error);
 });
 } else {
 alert("No patients found under the selected B2B name.");
 }
 } else {
 alert("Please enter a valid credit amount and select a B2B name.");
 }
 };
 
 const handleCreditAmountSave = (patientId) => {
 const patient = filteredPatients.find(p => p.patient_id === patientId);
 const creditAmount = creditAmounts[patientId];
 
 if (creditAmount >= 0) {
 // Update the patient's credit amount directly
 axios.patch(`https://lab.shinovadatabase.in/update-credit/${patient.patient_id}/`, {
 credit_amount: creditAmount,
 tests: patient.testname.map(test => ({
 ...test,
 credit_amount: (creditAmount / patient.testname.length).toFixed(2),
 })),
 })
 .then(response => {
 // Update the state for the patient in the filtered list
 const updatedPatients = filteredPatients.map(p =>
 p.patient_id === patientId
 ? { ...p, credit_amount: creditAmount }
 : p
 );
 setFilteredPatients(updatedPatients);
 
 // Recalculate total credit amount
 const updatedTotalCreditAmount = updatedPatients.reduce((sum, p) => {
 return sum + (parseFloat(p.credit_amount) || 0);
 }, 0);
 setTotalCreditAmount(updatedTotalCreditAmount);
 
 alert("Credit amount updated successfully!");
 })
 .catch(error => {
 console.error("Error updating credit amount:", error.response ? error.response.data : error);
 });
 } else {
 alert("Please enter a valid credit amount.");
 }
 };
 

 const handleSelectAll = () => {
 if (selectAll) {
 setSelectedPatientIds([]); // Clear all selections
 setOverallTotalAmount(filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.totalAmount) || 0), 0)); // Recalculate total for all
 setTotalCreditAmount(filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.credit_amount) || 0), 0)); // Recalculate credit for all
 } else {
 setSelectedPatientIds(filteredPatients.map(patient => patient.patient_id)); // Select all
 const totalAmount = filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.totalAmount) || 0), 0);
 const creditAmount = filteredPatients.reduce((sum, patient) => sum + (parseFloat(patient.credit_amount) || 0), 0);
 setOverallTotalAmount(totalAmount);
 setTotalCreditAmount(creditAmount);
 }
 setSelectAll(!selectAll); // Toggle "Select All" status
 };
 
 const handleIndividualSelect = (patientId, patientDate) => {
  setSelectedPatientIds((prevSelected) => {
    // Get all selected patient records
    const selectedPatients = filteredPatients.filter(patient => 
      prevSelected.includes(patient.patient_id)
    );

    // Check if the same patient_id exists with a different date
    const existingPatient = selectedPatients.find(p => p.patient_id === patientId);
    
    if (existingPatient && new Date(existingPatient.date).toDateString() !== new Date(patientDate).toDateString()) {
      alert("This patient is already selected with a different date.");
      return prevSelected; // Prevent selection
    }

    // Find all records of the patient with the same date
    const samePatientEntries = filteredPatients.filter(p =>
      p.patient_id === patientId && new Date(p.date).toDateString() === new Date(patientDate).toDateString()
    );

    let updatedSelection;

    if (prevSelected.includes(patientId)) {
      // Deselect all instances of this patient
      updatedSelection = prevSelected.filter(id => id !== patientId);
    } else {
      // Select all occurrences of this patient for the same date
      updatedSelection = [...prevSelected, ...samePatientEntries.map(p => p.patient_id)];
    }

    // Recalculate totals based on the updated selection
    const selectedPatientsData = filteredPatients.filter(p => updatedSelection.includes(p.patient_id));

    const totalAmount = selectedPatientsData.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0);
    const creditAmount = selectedPatientsData.reduce((sum, p) => sum + (parseFloat(p.credit_amount) || 0), 0);
    
    setOverallTotalAmount(totalAmount);
    setTotalCreditAmount(creditAmount);

    return updatedSelection;
  });
};

 
//  const formatDateToIST = (utcDateString) => {
//   const utcDate = new Date(utcDateString);
//   return utcDate.toLocaleString('en-IN', {
//     timeZone: 'Asia/Kolkata',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//   });
// };

 const exportToPDF = () => {
  if (selectedPatientIds.length === 0) {
  alert("Please select at least one patient to export.");
  return;
  }
  
  const selectedPatients = filteredPatients.filter(patient =>
  selectedPatientIds.includes(patient.patient_id)
  );
  
  const doc = new jsPDF();
  const tableColumn = ["Date", "B2B Name", "Test Name", "Test Amount", "Credit Amount"];
  // Title Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Invoice", 105, 15, { align: "center" });
  
  // Subtitle Section
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Shanmuga Diagnostics", 105, 22, { align: "center" });
  doc.text(`Date: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}`, 105, 28, { align: "center" });
  
  let currentY = 35; // Initial position for content
  let grandTotal = 0; // To calculate the grand total of all tests
  
  selectedPatients.forEach((patient, index) => {
  // Add a line separator before each patient's section except the first
  if (index > 0) {
  doc.setDrawColor(200, 200, 200);
  doc.line(14, currentY - 2, 196, currentY - 2); // Line width of the page
  }
  
  // Add Patient ID and Name as a section header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Patient ID: ${patient.patient_id}`, 14, currentY);
  currentY += 7; // Move down for the next line
  doc.text(`Patient Name: ${patient.patientname}`, 14, currentY);
  currentY += 10; // Add some spacing before the table
  
  // Prepare rows for the current patient
  const tableRows = [];
  patient.testname.forEach(test => {
  const testAmount = parseFloat(test.amount) || 0;
  const creditAmount = parseFloat(patient.credit_amount) || 0;
  
  tableRows.push([
  patient.date,
  patient.B2B,
  test.testname,
  `${testAmount.toFixed(2)}`,
  `${creditAmount.toFixed(2)}`,
  ]);
  
  grandTotal += testAmount;
  });
  
  // Add the table for the current patient
  doc.autoTable({
  head: [tableColumn],
  body: tableRows,
  startY: currentY,
  styles: { halign: "center", fillColor: [240, 240, 240] },
  headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
  alternateRowStyles: { fillColor: [250, 250, 250] },
  });
  
  // Update the currentY to the last position of the table
  currentY = doc.lastAutoTable.finalY + 15;
  });
  
  // Grand Total Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 102, 51); // Dark green color for the total amount
  doc.text(`Grand Total Amount: ${grandTotal.toFixed(2)}`, 14, currentY);
  
  // Footer Section
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated using Your Application Name", 105, 290, { align: "center" });
  
  // Save the PDF
  doc.save("InvoiceSummary.pdf");
  };
  

 return (
 <Container>
 <Title>Invoice Details</Title>
 <Label className='me-2' htmlFor="b2bFilter">Filter by B2B Name: </Label>
 <Select className='me-2' id="b2bFilter" value={selectedB2b} onChange={handleB2bChange}>
 <option value="">All</option>
 {b2bNames.map((name, index) => (
 <option key={index} value={name}>{name}</option>
 ))}
 </Select>
 <Label className='me-2'>Select Date Range: </Label>
 <DatePicker
 selectsRange={true}
 startDate={startDate}
 endDate={endDate}
 onChange={handleDateChange}
 isClearable={true}
 placeholderText="Select a date range"
 />
 <Label className='me-4'></Label>
 <input className='me-2'
 type="checkbox"
 checked={showCreditOnly}
 onChange={handleCreditToggle}
 />
 Credit Amount

 <button style={{float:"right"}} onClick={exportToPDF}>Export to PDF</button>

 <div className="table-container">
 <table className='table'>
 <thead>
 <tr>
 <th>
 <input
 type="checkbox"
 checked={selectAll}
 onChange={handleSelectAll}
 /> Select All
 </th>
 <th>Patient ID</th>
 <th>Date</th>
 <th>B2B Name</th>
 <th>Patient Name</th>
 <th>Test Name</th>
 <th>Test Amount</th>
 <th>Total Amount</th>
 <th>Credit Amount</th>

 </tr>
 </thead>
 <tbody>
 {filteredPatients.map((patient, index) =>
 patient.testname.map((test, testIndex) => (
 <React.Fragment key={`${index}-${testIndex}`}>
 <tr>
 {testIndex === 0 && (
 <td rowSpan={patient.testname.length}>
<input
  type="checkbox"
  checked={selectedPatientIds.includes(patient.patient_id)}
  onChange={() => handleIndividualSelect(patient.patient_id, patient.date)}
/>

 </td>
 )}
 <td>{testIndex === 0 && patient.patient_id}</td>
 <td>
  {testIndex === 0 &&
    new Date(patient.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}
</td>
 <td>{testIndex === 0 && patient.B2B}</td>
 <td>{testIndex === 0 && patient.patientname}</td>
 <td onClick={() => toggleExpandDetails(`${index}-${testIndex}`)}>
 {test.testname}
 </td>
 <td>{test.amount}</td>
 {testIndex === 0 && (
 <>
 <td rowSpan={patient.testname.length}>{patient.totalAmount}</td>
 <td rowSpan={patient.testname.length}>
 {editMode[patient.patient_id] ? (
 <>
 <CreditInput
 type="number"
 value={
 creditAmounts[patient.patient_id] !== undefined
 ? creditAmounts[patient.patient_id]
 : patient.credit_amount || 0
 }
 onChange={(e) =>
 handleCreditAmountChange(patient.patient_id, parseFloat(e.target.value) || 0)
 }
 />
 <SaveButton onClick={() => handleCreditAmountSave(patient.patient_id)}>Save</SaveButton>
 </>
 ) : (
 <>
 {patient.credit_amount || 0}
 <EditButton onClick={() => toggleEditMode(patient.patient_id)} />
 </>
 )}
 </td>
 </>
 )}
 </tr>
 </React.Fragment>
 ))
 )}
 </tbody>
 </table>
 </div>
 <Label>Total Credit for {selectedB2b || "B2B"}: </Label>
 <CreditInput
 type="number"
 value={b2bCreditAmount}
 onChange={handleB2bCreditAmountChange}
 placeholder="Enter total credit amount"
 />
 <button className='me-4' onClick={handleB2bCreditAmountSave}>Credit</button>
 <Label className='me-4'>Total Amount: ₹{overallTotalAmount.toFixed(2)}</Label>
 <Label className='me-4'>Total Credit Amount: ₹{totalCreditAmount.toFixed(2)}</Label>
 </Container>
 
 );
};
// Styled-components

const Container = styled.div`
  padding: 20px;
  max-width: 1300px;
  margin: 0 auto 20px; /* Added margin-bottom for spacing on smaller screens */
  background-color: #F9F9F9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  /* Responsive styles */
  @media (max-width: 1024px) { /* For tablets and smaller screens */
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 768px) { /* For mobile screens */
    padding: 10px;
    max-width: 95%;
    margin: 20px auto 15px; /* Adjusted margin-bottom */
  }

  @media (max-width: 480px) { /* For very small screens */
    padding: 8px;
    max-width: 100%;
    margin: 20px auto 10px; /* Further adjusted margin-bottom */
  }
`;

const CreditButton = styled.button`
 padding: 10px 20px;
 background-color: #28a745; /* Green background for credit button */
 color: white;
 font-size: 16px;
 font-weight: bold;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 transition: background-color 0.3s ease, transform 0.2s ease;

 &:hover {
 background-color: #218838; /* Darker green on hover */
 transform: scale(1.05); /* Slightly enlarge on hover */
 }

 &:focus {
 outline: none;
 box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Focus outline */
 }
`;
const Title = styled.h2`
 text-align: center;
 margin-bottom: 20px;
 color: #333;
`;

const Label = styled.label`
 margin: 10px 0;
 font-weight: 500;
 color: #555;
`;

const Select = styled.select`
 width: 20%;
 padding: 10px;
 font-size: 1em;
 color: #333;
 border: 1px solid #ddd;
 border-radius: 4px;
 margin-bottom: 20px;

 @media (max-width: 768px) {
 font-size: 0.9em;
 }
`;

const TableContainer = styled.div`
 overflow-x: auto;
 margin-top: 20px;
`;

const Table = styled.table`
 width: 100%;
 border-collapse: collapse;
 text-align: center;
`;

const TableHeader = styled.th`
 padding: 12px;
 background-color: #1A3A57;
 color: white;
`;

const TableRow = styled.tr`
 background-color: #F2F2F2;
 &:nth-child(even) { background-color: #FAFAFA; }
`;

const TableCell = styled.td`
 padding: 8px;
 border: 1px solid #DDD;
`;

const SaveButton = styled.button`
 background-color: #4CAF50;
 color: white;
 padding: 5px 10px;
 border: none;
 border-radius: 4px;
 cursor: pointer;
 font-size: 14px;
 
 &:hover {
 background-color: #45a049;
 }
`;

const EditButton = styled(FaEdit)`
 cursor: pointer;
 color: #ffa500;
 &:hover {
 color: #e07b00;
 }
`;

const CreditInput = styled.input`
 width: 100px;
 padding: 5px;
 margin: 5px;
 border: 1px solid #ddd;
 border-radius: 4px;
 font-size: 14px;
 text-align: right;
`;
export default Invoice;