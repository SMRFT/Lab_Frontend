import React, { useEffect, useState,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import styled from "styled-components"

import 'react-toastify/dist/ReactToastify.css';
import {
  ArrowLeft,
  Printer,
  ScanBarcodeIcon as BarcodeScan,
  RefreshCw,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react"

// Toast notification component
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Toast = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out forwards;
  max-width: 350px;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  &.success {
    background-color: #ecfdf5;
    border-left: 4px solid #10b981;
    color: #065f46;
  }
  
  &.error {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
  }
  
  &.warning {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    color: #92400e;
  }
  
  &.info {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }
`

const ToastMessage = styled.div`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
`

// Main container
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  margin-bottom: 1.5rem;
  
  &:hover {
    background-color: rgba(99, 102, 241, 0.1);
  }
`

const PageHeader = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  text-align: center;
`

const PatientCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const PatientCardHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1rem 1.5rem;
  color: white;
`

const PatientName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`

const PatientCardBody = styled.div`
  padding: 1rem 1.5rem;
`

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`

const PatientInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #334155;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
`

const TableHead = styled.thead`
  background-color: #f8fafc;
  
  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
    
    &:first-child {
      border-top-left-radius: 12px;
    }
    
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
`

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f8fafc;
    }
    
    &:not(:last-child) td {
      border-bottom: 1px solid #e2e8f0;
    }
  }
  
  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #334155;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PrimaryButton = styled(Button)`
  background-color: #6366f1;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #4f46e5;
  }
`

const SecondaryButton = styled(Button)`
  background-color: #f8fafc;
  color: #334155;
  border: 1px solid #e2e8f0;
  
  &:hover:not(:disabled) {
    background-color: #f1f5f9;
  }
`

const PrintSection = styled.div`
  display: none;
`

const BarcodeItem = styled.div`
  width: 50mm;
  height: 25mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  page-break-before: always;
`

const BarcodeText = styled.p`
  font-size: 10px;
  margin: 0;
  white-space: nowrap;
`

const BarcodeDate = styled.p`
  font-size: 9px;
  margin: 0;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  text-align: center;
`

const EmptyStateText = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0.5rem 0 0;
`

// Toast notification system
const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const ToastDisplay = () => (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast key={toast.id} className={toast.type}>
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "warning" && <AlertCircle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <ToastMessage>{toast.message}</ToastMessage>
        </Toast>
      ))}
    </ToastContainer>
  )

  return {
    success: (message) => addToast(message, "success"),
    error: (message) => addToast(message, "error"),
    warning: (message) => addToast(message, "warning"),
    info: (message) => addToast(message, "info"),
    ToastDisplay,
  }
}
const BarcodeTestDetails = () => {
  const location = useLocation();
  const toast = useToast()
  const printSectionRef = useRef(null)
  const navigate = useNavigate();
  const { patientId, selectedDate, gender,bill_no } = location.state || {};
  const [testDetails, setTestDetails] = useState([]);
  const [barcodeCounter, setBarcodeCounter] = useState(0);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const generateBarcode = (collectionContainer) => {
    const newBarcode = String(barcodeCounter).padStart(6, '0');
    setBarcodeCounter((prevCounter) => prevCounter + 1);
    return `${newBarcode}`;
  };
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    const fetchMaxBarcode = async () => {
      try {
        const response = await axios.get(`${Labbaseurl}get-max-barcode/`);
        const maxBarcode = response.data.next_barcode;
        setBarcodeCounter(maxBarcode);
      } catch (error) {
        console.error('Error fetching max barcode:', error);
        toast.error('Failed to fetch max barcode.');
      }
    };
    fetchMaxBarcode();
  }, []);
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedTests(testDetails.map(() => !selectAll));
  };
  const handleTestSelect = (index) => {
    const updatedSelectedTests = [...selectedTests];
    updatedSelectedTests[index] = !updatedSelectedTests[index];
    setSelectedTests(updatedSelectedTests);
  };
  const handleGenerateBarcode = async () => {
    if (!selectedPatient) {
      toast.error("Patient information is missing.")
      return false
    }

    try {
      setIsGenerating(true)
      let existingTests = []
      let existingBarcodeFound = false

      try {
        const response = await axios.get(`${Labbaseurl}get-existing-barcode/`, {
          params: {
            patient_id: patientId,
            date: selectedDate.toISOString().split("T")[0],
            bill_no: bill_no,
          },
        })

        existingTests = response.data.tests || []
        if (existingTests.length > 0) {
          existingBarcodeFound = true
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          existingTests = []
        } else {
          throw error
        }
      }

      if (existingBarcodeFound) {
        toast.warning("Barcode already generated for this patient and bill.")
        return false
      }

      const updatedTestDetails = testDetails.map((test) => {
        const existingTest = existingTests.find((t) => t.testname === test.testname)
        return { ...test, barcode: existingTest?.barcode || generateBarcode(test) }
      })

      setTestDetails(updatedTestDetails)

      const payload = {
        patient_id: patientId,
        patientname: selectedPatient?.patientname,
        age: selectedPatient?.age,
        gender: selectedPatient?.gender,
        date: formatDate(selectedPatient?.date),
        bill_no: bill_no,
        tests: updatedTestDetails,
        sample_collector: selectedPatient?.sample_collector,
        barcode: updatedTestDetails.length > 0 ? updatedTestDetails[0].barcode : generateBarcode({}),
        segment: selectedPatient?.segment,
      }

      const saveResponse = await axios.post(`${Labbaseurl}save-barcodes/`, payload)
      if (saveResponse.status === 201) {
        toast.success("All barcodes saved successfully!")
        return true
      }
    } catch (error) {
      console.error("Error generating barcode:", error)
      toast.error("Failed to generate barcode.")
    } finally {
      setIsGenerating(false)
    }

    return false
  }

  const handleReGenerateBarcode = async () => {
    if (!selectedPatient || !selectedDate || !bill_no) {
      toast.error("Patient, date, or bill number is missing.")
      return
    }

    try {
      setIsGenerating(true)
      const response = await axios.get(`${Labbaseurl}get-existing-barcode/`, {
        params: {
          patient_id: patientId,
          bill_no: bill_no,
          date: selectedDate.toISOString().split("T")[0],
        },
      })

      if (response.status === 200) {
        const existingTests = response.data.tests
        const updatedTestDetails = testDetails.map((test) => {
          const existingTest = existingTests.find((item) => item.testname === test.testname)
          return existingTest ? { ...test, barcode: existingTest.barcode } : test
        })

        setTestDetails(updatedTestDetails)
        toast.success("Barcodes updated successfully!")
      } else {
        toast.info("No barcode found. Generating a new one.")
        handleGenerateBarcode()
      }
    } catch (error) {
      console.error("Error regenerating barcode:", error)
      toast.error("Failed to regenerate barcode.")
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleGenerateAndPrint = async () => {
    const newBarcodesGenerated = await handleGenerateBarcode(); // Wait for barcode generation result
    if (newBarcodesGenerated) {
      setTimeout(() => {
        handlePrintBarcodes();
      }, 2000);
    }
  };
  
  const handleReGenerateAndPrint = () => {
    handleReGenerateBarcode();
    setTimeout(() => {
      handlePrintBarcodes();
    }, 2000);
  };
  const handlePrintBarcodes = () => {
    if (!printSectionRef.current) return

    setIsPrinting(true)

    // Create a hidden iframe
    const iframe = document.createElement("iframe")
    iframe.style.position = "absolute"
    iframe.style.width = "0px"
    iframe.style.height = "0px"
    iframe.style.border = "none"

    document.body.appendChild(iframe)
    const doc = iframe.contentWindow.document

    doc.open()
    doc.write(`
      <html>
      <head>
        <style>
          @page {
            size: 50mm 25mm;
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
          }
          .barcode-item {
            width: 50mm;
            height: 25mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            page-break-before: always;
          }
          .barcode-text {
            font-size: 10px;
            margin: 0;
            white-space: nowrap;
          }
          .barcode-date {
            font-size: 9px;
            margin: 0;
          }
          svg {
            width: 48mm !important;
            height: 18mm !important;
          }
        </style>
      </head>
      <body>
        ${printSectionRef.current.innerHTML}
      </body>
      </html>
    `)
    doc.close()

    // Print once content is loaded
    iframe.contentWindow.onload = () => {
      iframe.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(iframe)
        setIsPrinting(false)
        toast.success("Barcodes sent to printer")
      }, 1000)
    }
  }
  
  
  const handleBack = () => {
    navigate("/BarcodeGeneration");
  };
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`${Labbaseurl}patients_get_barcode/?date=${selectedDate.toISOString().split('T')[0]}`);
        const patientData = response.data.data.find(
          patient => patient.patient_id === patientId && patient.bill_no === bill_no
        );
        if (patientData) {
          setSelectedPatient(patientData);
          setTestDetails(patientData.testname || []);
          setSelectedTests(new Array(patientData.testname?.length || 0).fill(false));
        } else {
          toast.error('Patient not found.');
        }
      } catch (error) {
        console.error('Error fetching test details:', error);
        toast.error('Failed to fetch test details.');
      }
    };
    if (patientId && selectedDate) {
      fetchTestDetails();
    }
  }, [patientId, selectedDate]);
   // Format the patient.date to show only the date
 const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if month is single digit
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
};
const hasBarcodes = testDetails.some((test) => test.barcode)
return (
  <PageContainer>
    <toast.ToastDisplay />

    <BackButton onClick={handleBack}>
      <ArrowLeft size={16} />
      Back to Barcode Generation
    </BackButton>

    <PageHeader>
      <Title>Test Details for Patient {patientId}</Title>
    </PageHeader>

    {selectedPatient ? (
      <>
        <PatientCard>
          <PatientCardHeader>
            <PatientName>{selectedPatient.patientname}</PatientName>
          </PatientCardHeader>
          <PatientCardBody>
            <PatientInfoGrid>
              <PatientInfoItem>
                <InfoLabel>Patient ID</InfoLabel>
                <InfoValue>
                  <User size={14} />
                  {patientId}
                </InfoValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <InfoLabel>Age</InfoLabel>
                <InfoValue>{selectedPatient.age} years</InfoValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <InfoLabel>Gender</InfoLabel>
                <InfoValue>{selectedPatient.gender}</InfoValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <InfoLabel>Date</InfoLabel>
                <InfoValue>
                  <Calendar size={14} />
                  {formatDate(selectedPatient.date)}
                </InfoValue>
              </PatientInfoItem>
              <PatientInfoItem>
                <InfoLabel>Bill No</InfoLabel>
                <InfoValue>
                  <FileText size={14} />
                  {bill_no}
                </InfoValue>
              </PatientInfoItem>
            </PatientInfoGrid>
          </PatientCardBody>
        </PatientCard>

        {isLoading ? (
          <EmptyState>
            <div className="animate-pulse">Loading test details...</div>
          </EmptyState>
        ) : testDetails.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <th>Test Name</th>
                  <th>Collection Container</th>
                  <th>Barcode</th>
                </tr>
              </TableHead>
              <TableBody>
                {testDetails.map((test, index) => (
                  <tr key={index}>
                    <td>{test.testname}</td>
                    <td>{test.collection_container}</td>
                    <td>{test.barcode ? <svg ref={(el) => el && JsBarcode(el, test.barcode)} /> : "No Barcode"}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState>
            <AlertCircle size={40} color="#94a3b8" />
            <EmptyStateText>No test details found for this patient.</EmptyStateText>
          </EmptyState>
        )}

        <ButtonsContainer>
          <PrimaryButton onClick={handleGenerateAndPrint} disabled={isGenerating || isPrinting || isLoading}>
            <BarcodeScan size={16} />
            {isGenerating ? "Generating..." : "Generate & Print Barcodes"}
          </PrimaryButton>

          <SecondaryButton onClick={handleReGenerateAndPrint} disabled={isGenerating || isPrinting || isLoading}>
            <RefreshCw size={16} />
            {isGenerating ? "Regenerating..." : "Regenerate & Print Barcodes"}
          </SecondaryButton>

          {hasBarcodes && (
            <SecondaryButton onClick={handlePrintBarcodes} disabled={isPrinting || isLoading}>
              <Printer size={16} />
              {isPrinting ? "Printing..." : "Print Barcodes"}
            </SecondaryButton>
          )}
        </ButtonsContainer>
      </>
    ) : (
      <EmptyState>
        <AlertCircle size={40} color="#94a3b8" />
        <EmptyStateText>Patient information not available.</EmptyStateText>
      </EmptyState>
    )}

    <PrintSection ref={printSectionRef}>
      {testDetails.map((test, index) => (
        <BarcodeItem key={index} className="barcode-item">
          <BarcodeText className="barcode-text">
            {selectedPatient?.patientname} | {selectedPatient?.age} |
            {selectedPatient?.gender === "Male" ? "M" : selectedPatient?.gender === "Female" ? "F" : ""}
          </BarcodeText>
          <BarcodeDate className="barcode-date">
            {selectedPatient?.date ? formatDate(selectedPatient.date) : ""}
          </BarcodeDate>
          <svg
            ref={(el) => {
              if (el && test.barcode) {
                JsBarcode(el, test.barcode, {
                  format: "CODE128",
                  width: 1.5,
                  height: 18,
                  displayValue: true,
                  fontSize: 9,
                  margin: 0,
                })
              }
            }}
          />
          <BarcodeText className="barcode-text">{test.barcode}</BarcodeText>
        </BarcodeItem>
      ))}
    </PrintSection>
  </PageContainer>
)
}

export default BarcodeTestDetails

