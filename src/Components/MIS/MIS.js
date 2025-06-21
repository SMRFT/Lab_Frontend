"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import axios from "axios"
import { Download, Search, Clock, User, FileText, Activity, Calendar } from "lucide-react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  
  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`

const DateInput = styled.input`
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  padding: 0.25rem;
`

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  width: 100%;
  
  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
  
  @media (min-width: 768px) {
    width: 300px;
  }
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  width: 100%;
`

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6366f1;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4f46e5;
  }
`

const TableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`

const TableHead = styled.thead`
  background-color: #f9fafb;
  
  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 500;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }
`

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f9fafb;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid #f3f4f6;
    }
  }
  
  td {
    padding: 0.75rem 1rem;
    color: #374151;
    vertical-align: top;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
  text-align: center;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #e0e7ff;
  color: #4f46e5;
`

const MIS = () => {
  const [data, setData] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    fetchConsolidatedData(date)
  }, [date])

  const fetchConsolidatedData = async (selectedDate) => {
    setLoading(true)
    try {
      const response = await axios.get(`${Labbaseurl}consolidated-data/`, {
        params: { date: selectedDate },
      })
      setData(response.data)
    } catch (error) {
      console.error("Error fetching consolidated data:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const formatProcessingTime = (registeredTime, dispatchTime) => {
    if (!registeredTime || !dispatchTime) {
      return "Pending"
    }
  
    try {
      const regTime = new Date(registeredTime)
      const dispTime = new Date(dispatchTime)
  
      if (isNaN(regTime.getTime()) || isNaN(dispTime.getTime())) {
        return "Pending"
      }
  
      const diffMs = Math.abs(dispTime - regTime) // Correct calculation
      const totalSeconds = Math.floor(diffMs / 1000)
  
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
  
      return `${String(hours).padStart(2, "0")}H:${String(minutes).padStart(2, "0")}M:${String(seconds).padStart(2, "0")}S`
    } catch (error) {
      console.error("Error formatting processing time:", error)
      return "Error"
    }
  }
  

  const formatTime = (dateStr) => {
    if (dateStr === "pending" || !dateStr || dateStr === null) {
      return "Pending"
    }

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return "Pending"
    }

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }

    return new Intl.DateTimeFormat("en-IN", options).format(date)
  }

  const groupedData = data.reduce((acc, row) => {
    const key = `${row.patient_name}_${row.age}`
    if (!acc[key]) {
      acc[key] = { ...row, tests: [] }
    }
    acc[key].tests.push(row)
    return acc
  }, {})

  const exportToExcel = () => {
    if (!date) {
      alert("Please select a date!")
      return
    }

    try {
      const selectedDate = new Date(date)
      const formattedDate = selectedDate.toLocaleDateString("en-GB").replace(/\//g, "-")

      const filterDate = selectedDate.toISOString().split("T")[0]
      const filteredData = data.filter((row) => row.date.startsWith(filterDate))

      if (filteredData.length === 0) {
        alert("No data available for the selected date!")
        return
      }

      const formattedData = filteredData.map((row) => ({
        Date: formattedDate,
        "Patient ID": row.patient_id,
        "Patient Name": row.patient_name,
        Age: row.age,
        "Test Name": row.test_name,
        Department: row.department,
        "Registered Time": formatTime(row.date),
        "Collected Time": formatTime(row.collected_time),
        "Received Time": formatTime(row.received_time),
        "Approval Time": formatTime(row.approval_time),
        "Dispatch Time": formatTime(row.dispatch_time),
        "Processing Time": formatProcessingTime(row.date, row.dispatch_time),
      }))

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "MIS Data")
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      saveAs(dataBlob, `MIS_Report_${formattedDate}.xlsx`)
    } catch (error) {
      console.error("Error exporting Excel:", error)
      alert("An error occurred while exporting the data.")
    }
  }

  const filteredPatients = Object.values(groupedData).filter(
    (patient) =>
      patient.patient_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      patient.tests.some(
        (test) =>
          test.test_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          test.department?.toLowerCase().includes(searchQuery?.toLowerCase()),
      ),
  )

  return (
    <Container>
      <Header>
        <Title>
          <span>Patient Processing Details</span>
        </Title>

        <Controls>
          <DatePickerWrapper>
            <Calendar size={16} color="#6b7280" />
            <DateInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </DatePickerWrapper>

          <SearchWrapper>
            <Search size={16} color="#6b7280" />
            <SearchInput
              type="text"
              placeholder="Search patient, test, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <ExportButton onClick={exportToExcel}>
            <Download size={16} />
            <span>Export</span>
          </ExportButton>
        </Controls>
      </Header>

      {loading ? (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      ) : (
        <TableContainer>
          <StyledTable>
            <TableHead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Barcode</th>
                <th>Age</th>
                <th>Test Name</th>
                <th>Department</th>
                <th>Registered</th>
                <th>Collected</th>
                <th>Received</th>
                <th>Approved</th>
                <th>Dispatched</th>
                <th>Processing Time</th>
              </tr>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((group, groupIndex) =>
                  group.tests.map((test, testIndex) => (
                    <tr key={`${groupIndex}-${testIndex}`}>
                      {testIndex === 0 && (
                        <>
                          <td rowSpan={group.tests.length}>
                            <Badge>{group.patient_id}</Badge>
                          </td>
                          <td rowSpan={group.tests.length}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <User size={16} color="#6b7280" />
                              <span>{group.patient_name}</span>
                            </div>
                          </td>
                          <td rowSpan={group.tests.length}>{group.barcode}</td>
                          <td rowSpan={group.tests.length}>{group.age}</td>
                        </>
                      )}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FileText size={16} color="#6b7280" />
                          <span>{test.test_name}</span>
                        </div>
                      </td>
                      <td>{test.department}</td>
                      <td>{new Date(test.date).toLocaleTimeString('en-IN', { hour12: false })}</td>
                      <td>{formatTime(test.collected_time)}</td>
                      <td>{formatTime(test.received_time)}</td>
                      <td>{formatTime(test.approval_time)}</td>
                      <td>{formatTime(test.dispatch_time)}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Clock size={16} color="#6b7280" />
                          <span>{formatProcessingTime(test.date, test.dispatch_time)}</span>
                        </div>
                      </td>
                    </tr>
                  )),
                )
              ) : (
                <tr>
                  <td colSpan={12}>
                    <EmptyState>
                      <Activity size={32} color="#9ca3af" />
                      <p>No data available for the selected criteria</p>
                    </EmptyState>
                  </td>
                </tr>
              )}
            </TableBody>
          </StyledTable>
        </TableContainer>
      )}
    </Container>
  )
}

export default MIS