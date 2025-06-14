import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Styled Components
import { Calendar, User, ChevronRight, Search, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

// Modern styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  text-align: center;
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`

const SearchInput = styled.input`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 1rem;
  width: 100%;
  background-color: #f8fafc;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`

const DatePickerContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledDatePicker = styled.input`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  background-color: #f8fafc;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
  }
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`

const PatientCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

const CardHeader = styled.div`
  padding: 1.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
`

const CardBody = styled.div`
  padding: 1.25rem;
`

const PatientName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
`

const CardFooter = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(99, 102, 241, 0.1);
  }
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: #e0e7ff;
  color: #4f46e5;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8fafc;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
  grid-column: 1 / -1;
`

const EmptyStateText = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0.5rem 0 0;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => props.active ? '#6366f1' : '#f8fafc'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: 1px solid ${props => props.active ? '#6366f1' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4f46e5' : '#e2e8f0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  padding: 0 1rem;
`

const BarcodeGeneration = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const patientsPerPage = 12;
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const navigate = useNavigate();
  
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `${Labbaseurl}patients_get_barcode/?date=${selectedDate.toISOString().split('T')[0]}`
      );
      const data = response.data.data;
      if (Array.isArray(data)) {
        setAllPatients(data);
        setFilteredPatients(data);
        setTotalPages(Math.ceil(data.length / patientsPerPage));
      } else {
        console.error('Invalid data format:', data);
        setAllPatients([]);
        setFilteredPatients([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setAllPatients([]);
      setFilteredPatients([]);
      setTotalPages(1);
    }
  };
  
  const handleCardClick = (patient) => {
    navigate("/BarcodeTestDetails", {
      state: {
        patientId: patient.patient_id,
        patientName: patient.patientname,
        age: patient.age,
        gender: patient.gender,
        bill_no: patient.bill_no,
        selectedDate: selectedDate
      }
    });
  };
  
  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter(patient => {
        const searchLower = searchTerm.toLowerCase();
        return (
          patient.patientname?.toLowerCase().includes(searchLower) ||
          patient.bill_no?.toString().includes(searchLower) ||
          patient.age?.toString().includes(searchLower) ||
          patient.gender?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPatients(filtered);
    }
    
    setCurrentPage(1);
    setTotalPages(Math.max(1, Math.ceil(filteredPatients.length / patientsPerPage)));
  }, [searchTerm, allPatients]);
  
  // Update displayed patients based on current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    setDisplayedPatients(filteredPatients.slice(startIndex, startIndex + patientsPerPage));
  }, [currentPage, filteredPatients]);
  
  // Fetch patients when date changes
  useEffect(() => {
    fetchPatients();
    setSearchTerm('');
    setCurrentPage(1);
  }, [selectedDate]);
  
  // Format the patient.date to show only the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const getGenderBadgeStyle = (gender) => {
    if (gender.toLowerCase() === "male") {
      return {
        bg: "#dbeafe",
        color: "#2563eb",
      }
    } else if (gender.toLowerCase() === "female") {
      return {
        bg: "#fce7f3",
        color: "#db2777",
      }
    } else {
      return {
        bg: "#e0e7ff",
        color: "#4f46e5",
      }
    }
  }
  
  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
  }
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Patient Barcode Generation</Title>
        <Subtitle>Select a date to view patients and generate barcodes for their lab tests</Subtitle>
      </PageHeader>
      
      <ControlsContainer>
        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name, bill no, age..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <DatePickerContainer>
          <StyledDatePicker
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </DatePickerContainer>
      </ControlsContainer>
      
      <CardsGrid>
        {displayedPatients.length > 0 ? (
          displayedPatients.map((patient, index) => {
            const genderStyle = getGenderBadgeStyle(patient.gender)
            
            return (
              <PatientCard key={index} onClick={() => handleCardClick(patient)}>
                <CardHeader>
                  <PatientName>
                    <User size={18} />
                    {patient.patientname}
                  </PatientName>
                </CardHeader>
                
                <CardBody>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>Age</InfoLabel>
                      <InfoValue>{patient.age} years</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Gender</InfoLabel>
                      <Badge style={{ backgroundColor: genderStyle.bg, color: genderStyle.color }}>
                        {patient.gender}
                      </Badge>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Date</InfoLabel>
                      <InfoValue>{formatDate(patient.date)}</InfoValue>
                    </InfoItem>
                    {patient.bill_no && (
                      <InfoItem>
                        <InfoLabel>Bill No</InfoLabel>
                        <InfoValue>#{patient.bill_no}</InfoValue>
                      </InfoItem>
                    )}
                  </InfoGrid>
                </CardBody>
                
                <CardFooter>
                  <ViewButton>
                    Generate Barcode
                    <ChevronRight size={16} />
                  </ViewButton>
                </CardFooter>
              </PatientCard>
            )
          })
        ) : (
          <EmptyState>
            <Calendar size={40} color="#94a3b8" />
            <EmptyStateText>
              {searchTerm ? 'No matching patients found. Try a different search term.' : 'No patients found for the selected date.'}
            </EmptyStateText>
          </EmptyState>
        )}
      </CardsGrid>
      
      {filteredPatients.length > 0 && (
        <PaginationContainer>
          <PageButton 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </PageButton>
          
          {[...Array(Math.min(totalPages, 5))].map((_, index) => {
            let pageNumber;
            // Show pages around current page
            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }
            
            return (
              <PageButton
                key={pageNumber}
                active={currentPage === pageNumber}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            );
          })}
          
          <PageButton 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon size={16} />
          </PageButton>
          
          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>
        </PaginationContainer>
      )}
    </PageContainer>
  )
}

export default BarcodeGeneration