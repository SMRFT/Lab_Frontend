"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { format } from "date-fns"
import styled, { createGlobalStyle, ThemeProvider } from "styled-components"
import { Calendar, Search, Check, X, AlertCircle, CheckCircle } from "lucide-react"

// Theme
const theme = {
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    secondary: "#6b7280",
    secondaryHover: "#4b5563",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    background: "#ffffff",
    backgroundAlt: "#f9fafb",
    text: "#1f2937",
    textLight: "#6b7280",
    border: "#e5e7eb",
    borderDark: "#d1d5db",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
}

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.backgroundAlt};
    line-height: 1.5;
  }
`

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0 2rem;
  }
`

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.875rem;
  }
`

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${(props) => props.theme.colors.borderDark};
  }
`

const DateDisplay = styled.span`
  font-weight: 500;
`

const CalendarContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  margin-top: 0.5rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const CalendarDay = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: none;
  background-color: ${(props) => (props.selected ? props.theme.colors.primary : "transparent")};
  color: ${(props) => (props.selected ? "white" : props.theme.colors.text)};
  cursor: pointer;
  
  &:hover {
    background-color: ${(props) => (props.selected ? props.theme.colors.primaryHover : props.theme.colors.backgroundAlt)};
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.primary};
  }
`

const SearchIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textLight};
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.textLight};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  vertical-align: middle;
`

const Tr = styled.tr`
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundAlt};
  }
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) =>
    props.primary &&
    `
    background-color: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.primaryHover};
    }
  `}
  
  ${(props) =>
    props.secondary &&
    `
    background-color: white;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background-color: ${props.theme.colors.backgroundAlt};
    }
  `}
  
  ${(props) =>
    props.success &&
    `
    background-color: ${props.theme.colors.success};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.success}e6;
    }
  `}
  
  ${(props) =>
    props.danger &&
    `
    background-color: ${props.theme.colors.danger};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.danger}e6;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.md};
  
  ${(props) =>
    props.pending &&
    `
    background-color: ${props.theme.colors.warning}20;
    color: ${props.theme.colors.warning};
  `}
  
  ${(props) =>
    props.collected &&
    `
    background-color: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: 15%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.textLight};
  
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${(props) => props.theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`

const Alert = styled.div`
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${(props) =>
    props.success &&
    `
    background-color: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}
  
  ${(props) =>
    props.error &&
    `
    background-color: ${props.theme.colors.danger}20;
    color: ${props.theme.colors.danger};
  `}
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`

const EmptyStateText = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  margin-top: 1rem;
  max-width: 24rem;
`

// Calendar component
const SimpleDatePicker = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isSelectedDate = (date) => {
    return (
      date &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <Button secondary onClick={prevMonth}>
          &lt;
        </Button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <Button secondary onClick={nextMonth}>
          &gt;
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} style={{ textAlign: "center", padding: "0.25rem" }}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <CalendarDay key={index} selected={isSelectedDate(day)} onClick={() => day && onChange(day)} disabled={!day}>
            {day ? day.getDate() : ""}
          </CalendarDay>
        ))}
      </CalendarGrid>
      <ButtonGroup>
        <Button secondary onClick={onClose}>
          Close
        </Button>
      </ButtonGroup>
    </CalendarContainer>
  )
}

// Main component
const SampleStatus = () => {
  const storedName = localStorage.getItem("name")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [savedTests, setSavedTests] = useState({})
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [testDetails, setTestDetails] = useState({})
  const [selectedTests, setSelectedTests] = useState([])
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    const fetchPatientsByDate = async () => {
      setLoading(true)
      try {
        const localDate = new Date(selectedDate)
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset())
        const formattedDate = localDate.toISOString().split("T")[0]
        const response = await axios.get(`${Labbaseurl}sample_patient/`, {
          params: { date: formattedDate },
        })
        const patientsData = typeof response.data === "string" ? JSON.parse(response.data) : response.data
        setPatients(patientsData.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`${Labbaseurl}test_details/`)
        const details = response.data.reduce((acc, detail) => {
          acc[detail["test_name"]] = {
            collection_container: detail["collection_container"],
            department: detail["department"],
          }
          return acc
        }, {})
        setTestDetails(details)
      } catch (err) {
        console.error("Error fetching test details:", err)
      }
    }

    fetchPatientsByDate()
    fetchTestDetails()
  }, [selectedDate])

  const handleStatusChange = (patientId, testIndex, status) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.patient_id === patientId
          ? {
              ...patient,
              tests: patient.tests.map((test, index) => (index === testIndex ? { ...test, status } : test)),
            }
          : patient,
      ),
    )
  }

  const toggleSelectTest = (patientId, testIndex) => {
    const testKey = `${patientId}-${testIndex}`
    setSelectedTests((prevSelected) =>
      prevSelected.includes(testKey) ? prevSelected.filter((key) => key !== testKey) : [...prevSelected, testKey],
    )
  }

  const saveAllTestsForPatient = async (patient) => {
    try {
      const formattedDate1 = new Date(patient.date).toISOString()
      const formattedData = {
        patient_id: patient.patient_id,
        patientname: patient.patientname,
        barcode: patient.barcode,
        segment: patient.segment,
        age: patient.age,
        date: formattedDate1,
        testdetails: patient.tests.map((test) => ({
          testname: test.testname,
          container: testDetails[test.testname]?.collection_container || "N/A",
          department: testDetails[test.testname]?.department || "N/A",
          samplecollector: patient.sample_collector || "N/A",
          samplestatus: test.status || "Pending",
          samplecollected_time: null,
          received_time: null,
          rejected_time: null,
          oursourced_time: null,
          collectd_by: null,
          received_by: null,
          rejected_by: null,
          oursourced_by: null,
          remarks: null,
        })),
      }

      await axios.post(`${Labbaseurl}sample_status/`, [formattedData])

      setSavedTests((prev) => ({
        ...prev,
        [patient.patient_id]: formattedData,
      }))

      setSuccessMessage(`All test data saved successfully for ${patient.patientname}`)
      setError(null)

      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Error saving test data:", error)
      setError("Data already exists")
      setSuccessMessage(null)

      // Auto-close error message after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const updateSelectedTests = async (patient) => {
    const updates = selectedTests
      .filter((key) => key.startsWith(patient.patient_id))
      .map((key) => {
        const [_, testIndex] = key.split("-")
        const test = patient.tests[+testIndex]
        return {
          testname: test.testname,
          samplestatus: test.status,
          collectd_by: storedName,
        }
      })

    try {
      await axios.put(`${Labbaseurl}update_sample_status/${patient.patient_id}/`, updates)

      setSuccessMessage("Selected tests updated successfully")
      setError(null)

      setSavedTests((prev) =>
        updates.reduce(
          (acc, updateData, index) => {
            const key = `${patient.patient_id}-${index}`
            const existingTest = prev[key] || {}
            acc[key] = {
              ...existingTest,
              ...updateData,
            }
            return acc
          },
          { ...prev },
        ),
      )

      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      console.error("Error updating test statuses:", err)
      setError("No updates made")

      // Auto-close error message after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const selectAllTests = (patient) => {
    const allSelected =
      selectedTests.filter((key) => key.startsWith(patient.patient_id)).length === patient.tests.length

    if (allSelected) {
      setSelectedTests(selectedTests.filter((key) => !key.startsWith(patient.patient_id)))
      patient.tests.forEach((test, index) => {
        handleStatusChange(patient.patient_id, index, "Pending")
      })
    } else {
      const newSelectedTests = patient.tests.map((_, index) => `${patient.patient_id}-${index}`)
      setSelectedTests((prevSelected) => [...prevSelected, ...newSelectedTests])
      patient.tests.forEach((test, index) => {
        handleStatusChange(patient.patient_id, index, "Sample Collected")
      })
    }
  }

  const openModal = (patientId) => {
    setSelectedPatientId(patientId)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatientId(null)
    setError(null)
    setSuccessMessage(null)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.patientname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>Patient Sample Status</Title>
            <DatePickerWrapper>
              <DateButton onClick={() => setShowDatePicker(!showDatePicker)}>
                <Calendar size={16} />
                <DateDisplay>{format(selectedDate, "yyyy-MM-dd")}</DateDisplay>
              </DateButton>
              {showDatePicker && (
                <SimpleDatePicker
                  selectedDate={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date)
                    setShowDatePicker(false)
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </DatePickerWrapper>
          </Header>

          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {loading ? (
            <EmptyState>
              <div>Loading patients...</div>
            </EmptyState>
          ) : error ? (
            <Alert error>
              <AlertCircle size={16} />
              Error: {error}
            </Alert>
          ) : (
            <>
              {filteredPatients.length > 0 ? (
                <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Patient ID</Th>
                        <Th>Patient Name</Th>
                        <Th>Barcode ID</Th>
                        <Th>Age</Th>
                        <Th>Segment</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <Tr key={patient.patient_id}>
                          <Td>{patient.patient_id}</Td>
                          <Td>{patient.patientname}</Td>
                          <Td>{patient.barcode}</Td>
                          <Td>{patient.age}</Td>
                          <Td>{patient.segment || "N/A"}</Td>
                          <Td>
                            <Button primary onClick={() => openModal(patient.patient_id)}>
                              View Sample Status
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <EmptyState>
                  <EmptyStateText>No patients found for the selected date.</EmptyStateText>
                </EmptyState>
              )}
            </>
          )}
        </Card>

        {showModal && selectedPatientId && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  {patients.find((p) => p.patient_id === selectedPatientId)?.patientname} - Test Details
                </ModalTitle>
                <CloseButton onClick={closeModal}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              {error && (
                <Alert error>
                  <AlertCircle size={16} />
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert success>
                  <CheckCircle size={16} />
                  {successMessage}
                </Alert>
              )}

              {patients
                .filter((patient) => patient.patient_id === selectedPatientId)
                .map((patient) => (
                  <div key={patient.patient_id}>
                    <div style={{ marginBottom: "1rem" }}>
                      <strong>Patient ID:</strong> {patient.patient_id} |<strong> Barcode:</strong> {patient.barcode} |
                      <strong> Age:</strong> {patient.age}
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <Table>
                        <thead>
                          <tr>
                            <Th>Test Name</Th>
                            <Th>Container Type</Th>
                            <Th>Department</Th>
                            <Th>Status</Th>
                            <Th>
                              <Checkbox
                                checked={
                                  selectedTests.filter((key) => key.startsWith(patient.patient_id)).length ===
                                  patient.tests.length
                                }
                                onChange={() => selectAllTests(patient)}
                              />
                            </Th>
                            <Th>Sample Collector</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {patient.tests.map((test, index) => (
                            <Tr key={index}>
                              <Td>{test.testname}</Td>
                              <Td>{testDetails[test.testname]?.collection_container || "N/A"}</Td>
                              <Td>{testDetails[test.testname]?.department || "N/A"}</Td>
                              <Td>
                                <Select
                                  value={test.status || "Pending"}
                                  onChange={(e) => handleStatusChange(patient.patient_id, index, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Sample Collected">Collected</option>
                                </Select>
                              </Td>
                              <Td>
                                <Checkbox
                                  checked={selectedTests.includes(`${patient.patient_id}-${index}`)}
                                  onChange={() => toggleSelectTest(patient.patient_id, index)}
                                />
                              </Td>
                              <Td>{patient.sample_collector || "N/A"}</Td>
                            </Tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    <ButtonGroup>
                      <Button success onClick={() => saveAllTestsForPatient(patient)}>
                        <Check size={16} />
                        Save All
                      </Button>
                      <Button primary onClick={() => updateSelectedTests(patient)}>
                        Update Selected Tests
                      </Button>
                    </ButtonGroup>
                  </div>
                ))}
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default SampleStatus

