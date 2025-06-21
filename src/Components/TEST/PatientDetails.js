"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import styled, {
  createGlobalStyle,
  ThemeProvider,
  css,
} from "styled-components";
import {
  Calendar,
  Search,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  RefreshCcw,
  Clock,
  User,
  Tag,
  FileText,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

// Theme
const theme = {
  colors: {
    primary: "#0178A1",
    primaryHover: "#015d80",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#F4F6F9",
    backgroundAlt: "#FFFFFF",
    backgroundHover: "#F9FBFC",
    text: "#1F2937",
    textLight: "#6B7280",
    border: "#E5E7EB",
    borderDark: "#D1D5DB",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  transitions: {
    default: "all 0.2s ease-in-out",
    slow: "all 0.3s ease-in-out",
  },
};

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
    background-color: ${(props) => props.theme.colors.background};
    line-height: 1.5;
  }

  // Custom DatePicker Styles
  .react-datepicker-wrapper {
    width: auto;
  }

  .react-datepicker {
    font-family: inherit;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.borderRadius.lg};
    box-shadow: ${(props) => props.theme.shadows.lg};
  }

  .react-datepicker__header {
    background-color: ${(props) => props.theme.colors.background};
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  .react-datepicker__day--selected {
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
  }

  .react-datepicker__day:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
    color: white;
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 1280px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${(props) => props.theme.colors.backgroundAlt};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  box-shadow: ${(props) => props.theme.shadows.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => props.theme.colors.backgroundAlt};
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: ${(props) => props.theme.transitions.default};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

  label {
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.875rem;
  }

  .react-datepicker-wrapper {
    width: auto;
  }

  input {
    border: none;
    background: transparent;
    color: ${(props) => props.theme.colors.text};
    font-size: 0.875rem;
    padding: 0.25rem;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  transition: ${(props) => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textLight};
  pointer-events: none;
`;

const TableWrapper = styled.div`
  position: relative;
  overflow-x: auto;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  white-space: nowrap;
  top: 0;
  z-index: 10;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundHover};
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const TestButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.backgroundAlt};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};
  width: 100%;
  justify-content: space-between;

  &:hover {
    background: ${(props) => props.theme.colors.background};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  ${(props) => {
    switch (props.status) {
      case "Approved":
        return css`
          background-color: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case "Rerun Initiated":
        return css`
          background-color: ${props.theme.colors.danger}20;
          color: ${props.theme.colors.danger};
        `;
      default:
        return css`
          background-color: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: ${(props) => props.theme.colors.backgroundAlt};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: 2px dashed ${(props) => props.theme.colors.border};
`;

const EmptyStateText = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  margin-top: 1rem;
  max-width: 24rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 50%;
  border-top-color: ${(props) => props.theme.colors.primary};
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;

  svg {
    color: ${(props) => props.theme.colors.textLight};
  }
`;

const TestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Main Component
const PatientDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patientDetails, setPatientDetails] = useState([]);
  const [testDetails, setTestDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const [patientResponse, testResponse] = await Promise.all([
          axios.get(
            `${Labbaseurl}samplestatus-testvalue/?date=${formattedDate}`
          ),
          axios.get(`${Labbaseurl}testvalue/?date=${formattedDate}`),
        ]);

        setPatientDetails(patientResponse.data);

        const testDetailsMap = {};
        testResponse.data.forEach((patient) => {
          testDetailsMap[patient.patient_id] = patient.testdetails.map(
            (test) => ({
              testname: test.testname,
              status: test.rerun
                ? "Rerun Initiated"
                : test.approve
                ? "Approved"
                : "Waiting for Doctor's Approval",
            })
          );
        });
        setTestDetails(testDetailsMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError("Failed to fetch patient details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [selectedDate]);

  const handlePatientClick = (patientId, barcode, testName) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const encodedTestName = encodeURIComponent(testName);
    const encodedBarcode = encodeURIComponent(barcode);
    navigate(
      `/TestDetails?patient_id=${patientId}&date=${formattedDate}&barcode=${encodedBarcode}&test_name=${encodedTestName}`
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={12} />;
      case "Rerun Initiated":
        return <RefreshCcw size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const filteredPatients = patientDetails.filter(
    (patient) =>
      patient.patientname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Patient Test Details</Title>
        </Header>

        <Controls>
          <DatePickerWrapper>
            <Calendar size={16} color={theme.colors.textLight} />
            <label>Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
            />
          </DatePickerWrapper>

          <SearchWrapper>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
        </Controls>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <EmptyState>
            <AlertCircle size={24} color={theme.colors.danger} />
            <EmptyStateText>{error}</EmptyStateText>
          </EmptyState>
        ) : filteredPatients.length === 0 ? (
          <EmptyState>
            <AlertCircle size={24} color={theme.colors.textLight} />
            <EmptyStateText>
              No received tests available for the selected date.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Patient Info</Th>
                  <Th>Tests</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => {
                  const testData = testDetails[patient.patient_id] || [];
                  return (
                    <Tr key={index}>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          <PatientInfo>
                            <User size={14} />
                            <strong>{patient.patientname}</strong>
                          </PatientInfo>
                          <PatientInfo>
                            <Tag size={14} />
                            ID: {patient.patient_id}
                          </PatientInfo>
                          <PatientInfo>
                            <FileText size={14} />
                            Barcode: {patient.barcode}
                          </PatientInfo>
                          <PatientInfo>
                            <User size={14} />
                            Age: {patient.age}
                          </PatientInfo>
                        </div>
                      </Td>
                      <Td>
                        <TestList>
                          {patient.testdetails?.map((test, idx) => (
                            <TestButton
                              key={idx}
                              onClick={() =>
                                handlePatientClick(
                                  patient.patient_id,
                                  patient.barcode,
                                  test.testname
                                )
                              }
                              title="Click to Enter Test Values"
                            >
                              {test.testname}
                              <ChevronRight size={16} />
                            </TestButton>
                          ))}
                        </TestList>
                      </Td>
                      <Td>
                        <TestList>
                          {patient.testdetails?.map((test, idx) => {
                            const testStatus =
                              testData.find((t) => t.testname === test.testname)
                                ?.status || "Waiting for Doctor's Approval";
                            return (
                              <StatusBadge key={idx} status={testStatus}>
                                {getStatusIcon(testStatus)}
                                {testStatus}
                              </StatusBadge>
                            );
                          })}
                        </TestList>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default PatientDetails;
