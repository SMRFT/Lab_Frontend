"use client"

import { useState, useEffect } from "react"
import { Calendar, PencilIcon, Filter, ChevronDown, Trash2, Download, Search, CreditCard, Clock, X } from "lucide-react"
import styled, { keyframes } from "styled-components"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import Swal from "sweetalert2"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import headerImage from "./Images/Header.png"
import FooterImage from "./Images/Footer.png"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Container = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  animation: ${fadeIn} 0.3s ease-out;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
`

const Subtitle = styled.p`
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
  max-width: 600px;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
`

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
`

const Tab = styled.button`
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  border-bottom: 3px solid ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.$active ? "#3b82f6" : "#64748b")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.$active ? "#3b82f6" : "#1e293b")};
  }
`

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;
`

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 340px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 32px;
    width: 1px;
    background: #e2e8f0;
  }
`

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
`

const DateInput = styled.input`
  padding: 12px 16px;
  padding-left: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s;
  background: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
  }

  &:hover {
    border-color: #cbd5e1;
  }
`

const StyledCalendarIcon = styled(Calendar)`
  position: absolute;
  left: 12px;
  color: #64748b;
  width: 20px;
  height: 20px;
`

const SelectWrapper = styled.div`
  position: relative;
  min-width: 240px;

  &::after {
    content: '';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    pointer-events: none;
  }
`

const Select = styled.select`
  appearance: none;
  padding: 12px 16px;
  padding-right: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  width: 100%;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
  }

  &:hover {
    border-color: #cbd5e1;
  }
`

const StyledChevronDown = styled(ChevronDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  width: 20px;
  height: 20px;
  pointer-events: none;
`

const Button = styled.button`
  background: ${(props) => (props.$primary ? "#3b82f6" : "#fff")};
  color: ${(props) => (props.$primary ? "#fff" : "#3b82f6")};
  padding: 12px 20px;
  border: 1px solid ${(props) => (props.$primary ? "#3b82f6" : "#e2e8f0")};
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${(props) => (props.$primary ? "#2563eb" : "#f8fafc")};
    border-color: ${(props) => (props.$primary ? "#2563eb" : "#cbd5e1")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const TableContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  overflow: hidden;
`

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const TableTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
`

const Th = styled.th`
  background: #f8fafc;
  color: #475569;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 14px;
  transition: all 0.2s;

  ${(props) =>
    props.$amount &&
    `
    font-weight: 600;
    color: #059669;
  `}
  
  ${(props) =>
    props.$pending &&
    `
    font-weight: 600;
    color: #e11d48;
  `}
`

const TableRow = styled.tr`
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
  }
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
    color: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const AmountInput = styled.input`
  padding: 10px 14px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 14px;
  width: 140px;
  font-weight: 600;
  color: #059669;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
`

const ScrollContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

const Badge = styled.span`
  padding: 4px 8px;
  background: ${(props) => (props.$primary ? "#dbeafe" : "#f1f5f9")};
  color: ${(props) => (props.$primary ? "#2563eb" : "#475569")};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`

const SearchInput = styled.input`
  width: 50%;
  max-width: 300px;
  padding: 12px 16px;
  padding-left: 42px;
  border: 3px solid #e2e8f0;
  border-radius: 30px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`

const TabContent = styled.div`
  display: ${(props) => (props.$active ? "block" : "none")};
`

const PaymentInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

const PaymentInputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
`

const PaymentLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  min-width: 120px;
`

const PaymentMethodSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  max-width: 200px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const PaymentDetailsInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  max-width: 300px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const PaymentInfoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f0f9ff;
  border-radius: 6px;
  font-size: 13px;
  color: #0369a1;
  margin-top: 4px;
`

const PaymentMethodIcon = styled(CreditCard)`
  width: 16px;
  height: 16px;
`

const PaymentHistoryContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

const HistoryItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`

const HistoryTitle = styled.h4`
  margin-bottom: 12px;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`

const HistoryDate = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
`

const HistoryDetail = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
  
  span:first-child {
    color: #64748b;
  }
  
  span:last-child {
    font-weight: 500;
    color: #334155;
  }
`

const HistoryChange = styled.span`
  color: ${(props) => (props.$increased ? "#059669" : "#e11d48")} !important;
  font-weight: 600 !important;
`

// New styled components for payment summary
const PaymentSummaryContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
`

const SummaryTitle = styled.h4`
  margin-bottom: 12px;
  color: #1e40af;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #bfdbfe;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #3b82f6;
  font-weight: 500;
`

const SummaryValue = styled.span`
  font-size: 14px;
  color: #1e40af;
  font-weight: 600;
`

const SummaryHighlight = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #dbeafe;
  border-radius: 6px;
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`

// New component for displaying payment details in dropdown
const PaymentDetailsDropdown = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`

const DropdownContent = styled.div`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  background-color: white;
  min-width: 250px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 8px;
  padding: 12px;
  left: 0;
  top: 100%;
  margin-top: 5px;
`

const PaymentDetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PaymentDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  
  span:first-child {
    color: #64748b;
    font-weight: 500;
  }
  
  span:last-child {
    color: #334155;
    font-weight: 600;
  }
`

// New Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 0;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`

const ModalBody = styled.div`
  padding: 24px;
`

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  position: sticky;
  bottom: 0;
  background: white;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`

const ModalSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ModalSectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const AmountCard = styled.div`
  background: ${(props) => props.$color || "#f8fafc"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.$noMargin ? "0" : "12px")};
`

const AmountLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`

const AmountValue = styled.div`
  font-size: ${(props) => (props.$large ? "24px" : "16px")};
  font-weight: 700;
  color: ${(props) => props.$color || "#334155"};
`

const PaymentHistoryAccordion = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
`

const AccordionHeader = styled.div`
  padding: 16px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
  }
`

const AccordionTitle = styled.h5`
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const AccordionIcon = styled(ChevronDown)`
  transition: transform 0.2s;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
`

const AccordionContent = styled.div`
  padding: ${(props) => (props.$isOpen ? "16px" : "0 16px")};
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.3s;
`

const B2BPatients = () => {
  const [activeTab, setActiveTab] = useState("generate")
  const [patients, setPatients] = useState([])
  const [b2bList, setB2BList] = useState([])
  const [selectedB2B, setSelectedB2B] = useState("")
  const [selectedPatients, setSelectedPatients] = useState([])
  const [invoices, setInvoices] = useState([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [openPaymentDetails, setOpenPaymentDetails] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showHistoryAccordion, setShowHistoryAccordion] = useState(false)

  useEffect(() => {
    fetchPatients()
    fetchInvoices()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await axios.get("https://lab.shinovadatabase.in/all-patients/")
      const filteredData = response.data.filter(
        (patient) => patient.segment === "B2B" && Number(patient.credit_amount) > 0,
      )
      setPatients(filteredData)
      const uniqueB2BNames = [...new Set(filteredData.map((patient) => patient.B2B).filter(Boolean))]
      setB2BList(uniqueB2BNames)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("https://lab.shinovadatabase.in/get-invoices/")
      setInvoices(response.data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  const handleSelectPatient = (patientId) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId],
    )
  }

  const handleSelectAll = () => {
    const filteredPatients = getFilteredPatients()
    setSelectedPatients(
      filteredPatients.length === selectedPatients.length ? [] : filteredPatients.map((p) => p.patient_id),
    )
  }

  const getFilteredPatients = () => {
    return patients.filter((p) => {
      const isB2BMatch = selectedB2B === "" || p.B2B === selectedB2B
      const isDateMatch =
        (!fromDate || new Date(p.date) >= new Date(fromDate)) && (!toDate || new Date(p.date) <= new Date(toDate))
      return isB2BMatch && isDateMatch
    })
  }

  const handleGenerateInvoice = async () => {
    const selectedData = patients.filter((p) => selectedPatients.includes(p.patient_id))
    if (selectedData.length === 0) {
      toast.warn("Please select at least one patient.", { autoClose: 3000 })
      return
    }

    const totalCreditAmount = selectedData.reduce((sum, p) => sum + Number(p.credit_amount), 0)

    const invoiceData = {
      labName: selectedB2B || "All Labs",
      generateDate: new Date().toISOString().split("T")[0],
      fromDate,
      toDate,
      invoiceNumber: "INV-" + Math.floor(1000 + Math.random() * 9000),
      totalCreditAmount: totalCreditAmount.toFixed(2),
      paidAmount: "0.00", // Initialize with zero paid amount
      pendingAmount: totalCreditAmount.toFixed(2), // Initially, pending amount equals total amount
      patients: selectedData,
      paymentDetails: {}, // Initialize empty payment details
    }

    try {
      await axios.post("https://lab.shinovadatabase.in/generate-invoice/", invoiceData)
      toast.success("Invoice Generated Successfully!", { autoClose: 3000 })
      fetchInvoices()
      setActiveTab("generated") // Switch to the Generated Invoices tab after successful generation
    } catch (error) {
      console.error("Error generating invoice:", error)
      toast.error("Failed to generate invoice. Please try again.", { autoClose: 3000 })
    }
  }
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  useEffect(() => {
    const userRole = localStorage.getItem("role")
    const storedName = localStorage.getItem("name")

    let parsedName = ""

    try {
      // Try parsing if the value is stored as JSON
      const jsonName = JSON.parse(storedName)
      parsedName = jsonName.name || "" // Extract only the name
    } catch (error) {
      // If parsing fails, use the value directly
      parsedName = storedName || ""
    }

    setRole(userRole || "")
    setName(parsedName)
  }, [])

  const handleEditInvoice = (invoice) => {
    // Parse payment details if they exist
    const paymentDetails = invoice.paymentDetails
      ? typeof invoice.paymentDetails === "string"
        ? JSON.parse(invoice.paymentDetails)
        : invoice.paymentDetails
      : {}

    // Parse payment history if it exists
    const paymentHistory = invoice.paymentHistory
      ? typeof invoice.paymentHistory === "string"
        ? JSON.parse(invoice.paymentHistory)
        : invoice.paymentHistory
      : []

    // Set the editing invoice with all necessary data
    setEditingInvoice({
      ...invoice,
      newAmount: invoice.totalCreditAmount,
      newPaidAmount: invoice.paidAmount || "0.00",
      newPendingAmount: invoice.pendingAmount || invoice.totalCreditAmount,
      paymentDate: paymentDetails.paymentDate || "",
      paymentMethod: paymentDetails.paymentMethod || "",
      paymentDetails: paymentDetails.details || "",
      paymentHistory: paymentHistory,
      // Store original values for comparison and display
      originalPaidAmount: invoice.paidAmount || "0.00",
      originalPendingAmount: invoice.pendingAmount || invoice.totalCreditAmount,
      originalTotalAmount: invoice.totalCreditAmount,
    })

    // Open the edit modal
    setShowEditModal(true)
  }

  const handleUpdateInvoice = async (invoiceNumber) => {
    try {
      const totalAmount = Number.parseFloat(editingInvoice.newAmount)
      // Calculate the new paid amount by adding the difference to the original paid amount
      const originalPaid = Number.parseFloat(editingInvoice.originalPaidAmount)
      const newPaidInput = Number.parseFloat(editingInvoice.newPaidAmount)

      // Calculate the pending amount based on total and paid
      const pendingAmount = Math.max(0, totalAmount - newPaidInput).toFixed(2)

      // Create payment details object
      const paymentDetails = {
        paymentDate: editingInvoice.paymentDate || "",
        paymentMethod: editingInvoice.paymentMethod || "",
        details: editingInvoice.paymentDetails || "",
      }

      // Create payment history entry
      const paymentHistoryEntry = {
        date: new Date().toISOString(),
        previousTotal: editingInvoice.originalTotalAmount,
        newTotal: editingInvoice.newAmount,
        previousPaid: editingInvoice.originalPaidAmount,
        newPaid: editingInvoice.newPaidAmount,
        previousPending: editingInvoice.originalPendingAmount,
        newPending: pendingAmount,
        updatedBy: name, // You can replace with actual user info if available
      }

      // Get existing payment history or initialize empty array
      const existingHistory = editingInvoice.paymentHistory
        ? typeof editingInvoice.paymentHistory === "string"
          ? JSON.parse(editingInvoice.paymentHistory)
          : editingInvoice.paymentHistory
        : []

      // Add new entry to history
      const updatedHistory = [...existingHistory, paymentHistoryEntry]

      await axios.put(`https://lab.shinovadatabase.in/update-invoice/${invoiceNumber}/`, {
        totalCreditAmount: editingInvoice.newAmount,
        paidAmount: editingInvoice.newPaidAmount,
        pendingAmount: pendingAmount,
        paymentDetails: JSON.stringify(paymentDetails),
        paymentHistory: JSON.stringify(updatedHistory),
      })

      toast.success("Invoice Updated successfully!", { autoClose: 3000 })
      setInvoices(
        invoices.map((invoice) =>
          invoice.invoiceNumber === invoiceNumber
            ? {
                ...invoice,
                totalCreditAmount: editingInvoice.newAmount,
                paidAmount: editingInvoice.newPaidAmount,
                pendingAmount: pendingAmount,
                paymentDetails: paymentDetails,
                paymentHistory: updatedHistory,
              }
            : invoice,
        ),
      )

      setEditingInvoice(null)
      setShowEditModal(false)
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast.error("Failed to update invoice", { autoClose: 3000 })
    }
  }

  const handleDeleteInvoice = async (invoiceNumber) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      width: "500px",
      heightAuto: false,
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://lab.shinovadatabase.in/delete-invoice/${invoiceNumber}/`)
        setInvoices(invoices.filter((invoice) => invoice.invoiceNumber !== invoiceNumber))
        Swal.fire({
          title: "Deleted!",
          text: "The invoice has been deleted.",
          icon: "success",
          customClass: {
            popup: "swal-custom-size",
          },
        })
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the invoice.",
          icon: "error",
          customClass: {
            popup: "swal-custom-size",
          },
        })
      }
    }
  }

  const getFilteredInvoices = () => {
    return invoices.filter((invoice) => invoice.labName.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    setEditingInvoice((prev) => {
      const newTotal = Number.parseFloat(value) || 0
      const newPaid = Number.parseFloat(prev.newPaidAmount) || 0
      const newPending = Math.max(0, newTotal - newPaid).toFixed(2)

      return {
        ...prev,
        newAmount: value,
        newPendingAmount: newPending,
      }
    })
  }

  const handlePaidAmountChange = (e) => {
    const value = e.target.value
    setEditingInvoice((prev) => {
      const newPaidAmount = Number.parseFloat(value) || 0
      const totalAmount = Number.parseFloat(prev.newAmount) || 0

      // Calculate new pending amount based on total and new paid amount
      const newPending = Math.max(0, totalAmount - newPaidAmount).toFixed(2)

      return {
        ...prev,
        newPaidAmount: value,
        newPendingAmount: newPending,
      }
    })
  }

  const handlePaymentDateChange = (e) => {
    setEditingInvoice((prev) => ({
      ...prev,
      paymentDate: e.target.value,
    }))
  }

  const handlePaymentMethodChange = (e) => {
    setEditingInvoice((prev) => ({
      ...prev,
      paymentMethod: e.target.value,
    }))
  }

  const handlePaymentDetailsChange = (e) => {
    setEditingInvoice((prev) => ({
      ...prev,
      paymentDetails: e.target.value,
    }))
  }

  const handleCancelEdit = () => {
    setEditingInvoice(null)
    setShowEditModal(false)
  }

  const handleKeyPress = (e, invoiceNumber) => {
    if (e.key === "Enter") {
      handleUpdateInvoice(invoiceNumber)
    }
  }

  // Toggle payment details dropdown
  const togglePaymentDetails = (invoiceNumber) => {
    setOpenPaymentDetails(openPaymentDetails === invoiceNumber ? null : invoiceNumber)
  }

  // Calculate payment changes for display
  const calculatePaymentChanges = () => {
    if (!editingInvoice) return null

    const originalTotal = Number.parseFloat(editingInvoice.originalTotalAmount) || 0
    const originalPaid = Number.parseFloat(editingInvoice.originalPaidAmount) || 0
    const originalPending = Number.parseFloat(editingInvoice.originalPendingAmount) || 0

    const newTotal = Number.parseFloat(editingInvoice.newAmount) || 0
    const newPaid = Number.parseFloat(editingInvoice.newPaidAmount) || 0
    const newPending = Number.parseFloat(editingInvoice.newPendingAmount) || 0

    const totalChange = newTotal - originalTotal
    const paidChange = newPaid - originalPaid
    const pendingChange = newPending - originalPending

    return {
      totalChange,
      paidChange,
      pendingChange,
      isIncreased: {
        total: totalChange > 0,
        paid: paidChange > 0,
        pending: pendingChange > 0,
      },
    }
  }

  const getBase64FromURL = async (url) => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(blob)
    })
  }

  const generatePDF = async (invoice) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    try {
      const headerBase64 = await getBase64FromURL(headerImage)
      const footerBase64 = await getBase64FromURL(FooterImage)

      // Add header
      doc.addImage(headerBase64, "PNG", 10, 5, 190, 30)

      // Title with more breathing room
      doc.setFont("helvetica", "bold")
      doc.setFontSize(22)
      doc.setTextColor(44, 62, 80) // Dark blue-gray color
      doc.text("INVOICE", 105, 50, { align: "center" })

      // Add a subtle separator line
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.5)
      doc.line(14, 55, 196, 55)

      // Invoice details section with improved layout
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(80, 80, 80)
      doc.text("INVOICE DETAILS", 14, 65)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(60, 60, 60)
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 73)
      doc.text(`Lab Name: ${invoice.labName}`, 14, 80)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 87)

      if (invoice.fromDate && invoice.toDate) {
        doc.text(
          `Period: ${new Date(invoice.fromDate).toLocaleDateString()} - ${new Date(invoice.toDate).toLocaleDateString()}`,
          14,
          94,
        )
      }

      // Add payment details if available
      let tableStartY = invoice.fromDate && invoice.toDate ? 105 : 98

      const paymentDetails = invoice.paymentDetails
        ? typeof invoice.paymentDetails === "string"
          ? JSON.parse(invoice.paymentDetails)
          : invoice.paymentDetails
        : null

      if (paymentDetails && (paymentDetails.paymentDate || paymentDetails.paymentMethod)) {
        doc.setFont("helvetica", "bold")
        doc.text("PAYMENT DETAILS", 14, tableStartY)
        tableStartY += 8

        doc.setFont("helvetica", "normal")
        if (paymentDetails.paymentDate) {
          doc.text(`Payment Date: ${new Date(paymentDetails.paymentDate).toLocaleDateString()}`, 14, tableStartY)
          tableStartY += 7
        }

        if (paymentDetails.paymentMethod) {
          doc.text(`Payment Method: ${paymentDetails.paymentMethod}`, 14, tableStartY)
          tableStartY += 7
        }

        if (paymentDetails.details) {
          doc.text(`Details: ${paymentDetails.details}`, 14, tableStartY)
          tableStartY += 10
        } else {
          tableStartY += 3
        }
      }

      // Inside the generatePDF function, after the payment details section
      const paymentHistory = invoice.paymentHistory
        ? typeof invoice.paymentHistory === "string"
          ? JSON.parse(invoice.paymentHistory)
          : invoice.paymentHistory
        : null

      if (paymentHistory && paymentHistory.length > 0) {
        tableStartY += 5
        doc.setFont("helvetica", "bold")
        doc.text("PAYMENT HISTORY", 14, tableStartY)
        tableStartY += 8

        doc.autoTable({
          startY: tableStartY,
          head: [["Date", "Previous Amount", "New Amount", "Updated By"]],
          body: paymentHistory.map((history) => [
            new Date(history.date).toLocaleDateString(),
            `₹${history.previousTotal} (Paid: ₹${history.previousPaid})`,
            `₹${history.newTotal} (Paid: ₹${history.newPaid})`,
            history.updatedBy || "System",
          ]),
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 4,
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [60, 60, 60],
            fontStyle: "bold",
          },
        })

        tableStartY = doc.lastAutoTable.finalY + 10
      }

      // Patients table with improved styling
      if (invoice.patients && invoice.patients.length > 0) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(80, 80, 80)
        doc.text("PATIENT DETAILS", 14, tableStartY - 5)

        doc.autoTable({
          startY: tableStartY,
          head: [["Patient ID", "Patient Name", "Date", "Credit Amount"]],
          body: invoice.patients.map((patient) => [
            patient.patient_id,
            patient.patientname,
            new Date(patient.date).toLocaleDateString(),
            `₹${Number.parseFloat(patient.credit_amount).toFixed(2)}`,
          ]),
          theme: "grid",
          styles: {
            fontSize: 10,
            cellPadding: 6,
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [60, 60, 60],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [249, 249, 249],
          },
        })

        const finalY = doc.lastAutoTable.finalY + 15

        // Summary section with payment details
        doc.setDrawColor(220, 220, 220)
        doc.setFillColor(249, 249, 249)
        doc.roundedRect(110, finalY, 80, 55, 2, 2, "F")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text("Summary", 120, finalY + 10)

        doc.setFont("helvetica", "normal")
        doc.setTextColor(60, 60, 60)
        doc.text("Total Items:", 120, finalY + 20)
        doc.text(`${invoice.patients.length}`, 170, finalY + 20, { align: "right" })

        // Total amount with better styling
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(44, 62, 80)
        doc.text("Total Amount:", 120, finalY + 30)
        doc.text(`₹${Number.parseFloat(invoice.totalCreditAmount).toFixed(2)}`, 170, finalY + 30, { align: "right" })

        // Add paid amount
        doc.setFont("helvetica", "normal")
        doc.setTextColor(39, 174, 96)
        doc.text("Paid Amount:", 120, finalY + 40)
        doc.text(`₹${Number.parseFloat(invoice.paidAmount || 0).toFixed(2)}`, 170, finalY + 40, { align: "right" })

        // Add pending amount
        doc.setTextColor(231, 76, 60)
        doc.text("Pending Amount:", 120, finalY + 50)
        doc.text(
          `₹${Number.parseFloat(invoice.pendingAmount || invoice.totalCreditAmount).toFixed(2)}`,
          170,
          finalY + 50,
          {
            align: "right",
          },
        )
      }

      // Footer
      doc.addImage(footerBase64, "PNG", 10, 270, 190, 20)

      doc.save(`Invoice-${invoice.invoiceNumber}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  // Helper function to get payment details display
  const getPaymentDetailsDisplay = (invoice) => {
    if (!invoice.paymentDetails) return null

    const details =
      typeof invoice.paymentDetails === "string" ? JSON.parse(invoice.paymentDetails) : invoice.paymentDetails

    if (!details || (!details.paymentDate && !details.paymentMethod)) return null

    return (
      <PaymentInfoBadge onClick={() => togglePaymentDetails(invoice.invoiceNumber)}>
        <PaymentMethodIcon />
        {details.paymentMethod && `${details.paymentMethod}`}
        {details.paymentDate && details.paymentMethod && " | "}
        {details.paymentDate && `Paid on ${new Date(details.paymentDate).toLocaleDateString()}`}

        <DropdownContent $isOpen={openPaymentDetails === invoice.invoiceNumber}>
          <PaymentDetailsList>
            <PaymentDetailItem>
              <span>Total Credit:</span>
              <span>₹{invoice.totalCreditAmount}</span>
            </PaymentDetailItem>
            <PaymentDetailItem>
              <span>Paid Amount:</span>
              <span style={{ color: "#059669" }}>₹{invoice.paidAmount || "0.00"}</span>
            </PaymentDetailItem>
            <PaymentDetailItem>
              <span>Pending Amount:</span>
              <span style={{ color: "#e11d48" }}>₹{invoice.pendingAmount || invoice.totalCreditAmount}</span>
            </PaymentDetailItem>
            {details.paymentMethod && (
              <PaymentDetailItem>
                <span>Payment Method:</span>
                <span>{details.paymentMethod}</span>
              </PaymentDetailItem>
            )}
            {details.details && (
              <PaymentDetailItem>
                <span>Details:</span>
                <span>{details.details}</span>
              </PaymentDetailItem>
            )}
          </PaymentDetailsList>
        </DropdownContent>
      </PaymentInfoBadge>
    )
  }

  return (
    <Container>
      <Header>
        <Title>B2B Patients Management</Title>
        <Subtitle>Manage credit amounts and generate invoices for B2B patients</Subtitle>
      </Header>

      <TabsContainer>
        <Tab $active={activeTab === "generate"} onClick={() => setActiveTab("generate")}>
          Generate Invoice
        </Tab>
        <Tab $active={activeTab === "generated"} onClick={() => setActiveTab("generated")}>
          Generated Invoices
        </Tab>
      </TabsContainer>

      <TabContent $active={activeTab === "generate"}>
        <FiltersRow>
          <DateFilterGroup>
            <DateInputWrapper>
              <StyledCalendarIcon />
              <DateInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="From Date"
              />
            </DateInputWrapper>
            <DateInputWrapper>
              <StyledCalendarIcon />
              <DateInput type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="To Date" />
            </DateInputWrapper>
          </DateFilterGroup>

          <SelectWrapper>
            <Select value={selectedB2B} onChange={(e) => setSelectedB2B(e.target.value)}>
              <option value="">All B2B Labs</option>
              {b2bList.map((b2bName, index) => (
                <option key={index} value={b2bName}>
                  {b2bName}
                </option>
              ))}
            </Select>
            <StyledChevronDown />
          </SelectWrapper>

          <Button onClick={handleSelectAll}>
            <Filter size={18} />
            {selectedPatients.length === getFilteredPatients().length ? "Deselect All" : "Select All"}
          </Button>

          {selectedPatients.length > 0 && (
            <Button $primary onClick={handleGenerateInvoice}>
              Generate Invoice
            </Button>
          )}
        </FiltersRow>

        <TableContainer>
          <ToastContainer position="top-right" autoClose={3000} />
          <TableHeader>
            <TableTitle>Patient List</TableTitle>
            <Badge $primary>{getFilteredPatients().length} Patients</Badge>
          </TableHeader>
          <ScrollContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Select</Th>
                  <Th>Date</Th>
                  <Th>Patient ID</Th>
                  <Th>Patient Name</Th>
                  <Th>B2B Name</Th>
                  <Th>Credit Amount</Th>
                </tr>
              </thead>
              <tbody>
                {getFilteredPatients().map((patient) => (
                  <TableRow key={patient.patient_id}>
                    <Td>
                      <Checkbox
                        type="checkbox"
                        checked={selectedPatients.includes(patient.patient_id)}
                        onChange={() => handleSelectPatient(patient.patient_id)}
                      />
                    </Td>
                    <Td>
                      {new Date(patient.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Td>
                    <Td>{patient.patient_id}</Td>
                    <Td>{patient.patientname}</Td>
                    <Td>
                      <Badge>{patient.B2B || "N/A"}</Badge>
                    </Td>
                    <Td $amount>₹{patient.credit_amount}</Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ScrollContainer>
        </TableContainer>
      </TabContent>

      <TabContent $active={activeTab === "generated"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <TableContainer>
          <TableHeader>
            <TableTitle>Generated Invoices</TableTitle>
            <Badge>{getFilteredInvoices().length} Invoices</Badge>
          </TableHeader>

          <SearchContainer>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search by lab name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <ScrollContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Invoice Number</Th>
                  <Th>Lab Name</Th>
                  <Th>Date Range</Th>
                  <Th>Total Amount</Th>
                  <Th>Paid Amount</Th>
                  <Th>Pending Amount</Th>
                  <Th>Payment Info</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {getFilteredInvoices().map((invoice) => (
                  <TableRow key={invoice.invoiceNumber}>
                    <Td>{invoice.invoiceNumber}</Td>
                    <Td>
                      <Badge>{invoice.labName}</Badge>
                    </Td>
                    <Td>
                      {invoice.fromDate && invoice.toDate
                        ? `${new Date(invoice.fromDate).toLocaleDateString()} - ${new Date(invoice.toDate).toLocaleDateString()}`
                        : "N/A"}
                    </Td>
                    <Td $amount>₹{invoice.totalCreditAmount}</Td>
                    <Td $amount>₹{invoice.paidAmount || "0.00"}</Td>
                    <Td $pending>₹{invoice.pendingAmount || invoice.totalCreditAmount}</Td>
                    <Td>{getPaymentDetailsDisplay(invoice)}</Td>
                    <Td>
                      <ActionContainer>
                        <IconButton onClick={() => handleEditInvoice(invoice)}>
                          <PencilIcon size={18} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteInvoice(invoice.invoiceNumber)} style={{ color: "red" }}>
                          <Trash2 size={18} />
                        </IconButton>
                        <IconButton onClick={() => generatePDF(invoice)} style={{ color: "green" }}>
                          <Download size={18} />
                        </IconButton>
                      </ActionContainer>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </ScrollContainer>
        </TableContainer>
      </TabContent>

      {/* Edit Payment Modal */}
      {showEditModal && editingInvoice && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>Edit Payment - {editingInvoice.invoiceNumber}</ModalTitle>
              <ModalCloseButton onClick={handleCancelEdit}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalSection>
                <ModalSectionTitle>
                  <CreditCard size={18} />
                  Payment Summary
                </ModalSectionTitle>

                <AmountCard $color="#f0f9ff">
                  <AmountRow>
                    <AmountLabel>Total Credit Amount</AmountLabel>
                    <AmountInput
                      type="number"
                      value={editingInvoice.newAmount}
                      onChange={handleAmountChange}
                      onKeyPress={(e) => handleKeyPress(e, editingInvoice.invoiceNumber)}
                    />
                  </AmountRow>
                </AmountCard>

                <AmountCard $color="#f0fff4">
                  <AmountRow>
                    <AmountLabel>Paid Amount</AmountLabel>
                    <AmountInput
                      type="number"
                      value={editingInvoice.newPaidAmount}
                      onChange={handlePaidAmountChange}
                      onKeyPress={(e) => handleKeyPress(e, editingInvoice.invoiceNumber)}
                    />
                  </AmountRow>
                </AmountCard>

                <AmountCard $color="#fff5f5">
                  <AmountRow $noMargin>
                    <AmountLabel>Pending Amount</AmountLabel>
                    <AmountValue $color="#e11d48">₹{editingInvoice.newPendingAmount}</AmountValue>
                  </AmountRow>
                </AmountCard>
              </ModalSection>

              <ModalSection>
                <ModalSectionTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Payment Details
                </ModalSectionTitle>

                <PaymentInputRow>
                  <PaymentLabel>Payment Date:</PaymentLabel>
                  <DateInput type="date" value={editingInvoice.paymentDate} onChange={handlePaymentDateChange} />
                </PaymentInputRow>

                <PaymentInputRow>
                  <PaymentLabel>Payment Method:</PaymentLabel>
                  <PaymentMethodSelect value={editingInvoice.paymentMethod} onChange={handlePaymentMethodChange}>
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </PaymentMethodSelect>
                </PaymentInputRow>

                <PaymentInputRow>
                  <PaymentLabel>Details:</PaymentLabel>
                  <PaymentDetailsInput
                    type="text"
                    placeholder="Transaction ID, Cheque No, etc."
                    value={editingInvoice.paymentDetails}
                    onChange={handlePaymentDetailsChange}
                  />
                </PaymentInputRow>
              </ModalSection>

              {editingInvoice.paymentHistory && editingInvoice.paymentHistory.length > 0 && (
                <ModalSection>
                  <PaymentHistoryAccordion>
                    <AccordionHeader onClick={() => setShowHistoryAccordion(!showHistoryAccordion)}>
                      <AccordionTitle>
                        <Clock size={18} />
                        Payment History
                      </AccordionTitle>
                      <AccordionIcon $isOpen={showHistoryAccordion} size={20} />
                    </AccordionHeader>

                    <AccordionContent $isOpen={showHistoryAccordion}>
                      {editingInvoice.paymentHistory
                        .slice()
                        .reverse()
                        .map((history, index) => (
                          <HistoryItem key={index}>
                            <HistoryDate>
                              {new Date(history.date).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </HistoryDate>
                            <HistoryDetail>
                              <span>Total Amount:</span>
                              <span>
                                ₹{history.previousTotal} →
                                <HistoryChange $increased={Number(history.newTotal) > Number(history.previousTotal)}>
                                  ₹{history.newTotal}
                                </HistoryChange>
                              </span>
                            </HistoryDetail>
                            <HistoryDetail>
                              <span>Paid Amount:</span>
                              <span>
                                ₹{history.previousPaid} →
                                <HistoryChange $increased={true}>₹{history.newPaid}</HistoryChange>
                              </span>
                            </HistoryDetail>
                            <HistoryDetail>
                              <span>Pending Amount:</span>
                              <span>
                                ₹{history.previousPending} →
                                <HistoryChange
                                  $increased={Number(history.newPending) < Number(history.previousPending)}
                                >
                                  ₹{history.newPending}
                                </HistoryChange>
                              </span>
                            </HistoryDetail>
                            {history.updatedBy && (
                              <HistoryDetail>
                                <span>Updated By:</span>
                                <span>{history.updatedBy}</span>
                              </HistoryDetail>
                            )}
                          </HistoryItem>
                        ))}
                    </AccordionContent>
                  </PaymentHistoryAccordion>
                </ModalSection>
              )}

              {calculatePaymentChanges() && (
                <SummaryHighlight>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {calculatePaymentChanges().paidChange > 0
                    ? `Adding ₹${calculatePaymentChanges().paidChange.toFixed(2)} to the paid amount`
                    : calculatePaymentChanges().paidChange < 0
                      ? `Reducing paid amount by ₹${Math.abs(calculatePaymentChanges().paidChange).toFixed(2)}`
                      : "No change to paid amount"}
                </SummaryHighlight>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button $primary onClick={() => handleUpdateInvoice(editingInvoice.invoiceNumber)}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default B2BPatients

