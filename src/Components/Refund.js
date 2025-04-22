import React, { useState } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #6366F1;
    --primary-hover: #4F46E5;
    --primary-light: #C7D2FE;
    --primary-dark: #4338CA;
    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;
    --gray-50: #F9FAFB;
    --gray-100: #F3F4F6;
    --gray-200: #E5E7EB;
    --gray-300: #D1D5DB;
    --gray-400: #9CA3AF;
    --gray-500: #6B7280;
    --gray-700: #374151;
    --gray-900: #111827;
    --border-radius: 8px;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --transition: all 0.2s ease;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: var(--gray-50);
    color: var(--gray-900);
    line-height: 1.5;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const Title = styled.h2`
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.75rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 3px;
    width: 60px;
    background: var(--primary);
    border-radius: 3px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
  font-weight: 500;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: var(--gray-700);
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--gray-700);
  cursor: pointer;
  
  &:hover {
    color: var(--primary);
  }
`;

const RadioInput = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid var(--gray-300);
  border-radius: 50%;
  margin-right: 0.5rem;
  transition: var(--transition);
  position: relative;
  
  &:checked {
    border-color: var(--primary);
    background-color: white;
  }
  
  &:checked:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background-color: var(--primary);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-light);
  }
`;

const Input = styled.input`
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: var(--gray-300);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: var(--primary);
  border: 1px solid var(--gray-300);
  
  &:hover {
    border-color: var(--primary);
    background-color: var(--gray-50);
  }
  
  &:disabled {
    color: var(--gray-400);
    border-color: var(--gray-200);
    background-color: var(--gray-100);
  }
`;

const ErrorMessage = styled.p`
  color: var(--danger);
  background-color: rgba(239, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  
  &:before {
    content: '⚠️';
    margin-right: 0.5rem;
  }
`;

const OTPContainer = styled.div`
  margin-top: 1.5rem;
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 1.5rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  background-color: var(--gray-100);
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
  font-weight: 500;
  color: var(--gray-700);
  
  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

const TableCell = styled.div`
  padding: 0.75rem;
  display: flex;
  align-items: center;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  border-bottom: 1px solid var(--gray-200);
  transition: var(--transition);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--gray-50);
  }
  
  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;

const Checkbox = styled.input`
  appearance: none;
  width: 1.125rem;
  height: 1.125rem;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  
  &:checked {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  
  &:checked:after {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 0.25rem;
    height: 0.5rem;
    border: solid white;
    border-width: 0 2px 2px 0;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-light);
  }
`;

const TotalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background-color: var(--gray-50);
  border-radius: var(--border-radius);
  font-weight: 500;
  border: 1px solid var(--gray-200);
`;

const Badge = styled.span`
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: var(--gray-500);
  text-align: center;
  
  &:before {
    content: "🔍";
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const OtpSentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.sent ? 'rgba(16, 185, 129, 0.1)' : 'var(--gray-100)'};
  color: ${props => props.sent ? 'var(--success)' : 'var(--gray-500)'};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
  
  &:before {
    content: ${props => props.sent ? '"✓"' : '"❓"'};
    margin-right: 0.25rem;
  }
`;

// Toast Container and Toast Styles
const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  background-color: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(16, 185, 129, 0.95)';
      case 'error': return 'rgba(239, 68, 68, 0.95)';
      case 'warning': return 'rgba(245, 158, 11, 0.95)';
      default: return 'rgba(99, 102, 241, 0.95)';
    }
  }};
  color: white;
  font-weight: 500;
  min-width: 280px;
  max-width: 400px;
  animation: slide-in 0.3s ease-out;
  
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

const ToastMessage = styled.p`
  flex: 1;
`;

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  margin-left: 0.5rem;
  
  &:hover {
    opacity: 1;
  }
`;

const Refund = () => {
  const [patientId, setPatientId] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [refundReason, setRefundReason] = useState("");

  // Function to add a toast
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  // Function to remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSearch = async () => {
    if (!patientId || !selectDate) {
      setError("Both Patient ID and Date are required.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.get("https://lab.shinovadatabase.in/search_refund/", {
        params: { patient_id: patientId, date: selectDate },
      });
      setPatients(response.data.patients);
      setIsLoading(false);
      
      if (response.data.patients.length === 0) {
        addToast("No patients found with the given criteria.", "warning");
      } else {
        addToast(`Found ${response.data.patients.length} patient records.`, "success");
      }
    } catch (err) {
      setError("Error fetching data. Please try again.");
      addToast("Failed to fetch patient data. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const handleTestSelection = (test, isChecked) => {
    setSelectedTests((prev) =>
      isChecked
        ? [...prev, test]
        : prev.filter((item) => item.testname !== test.testname)
    );
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allTests = patients.flatMap((p) =>
        Array.isArray(p.testname) ? p.testname : JSON.parse(p.testname)
      );
      setSelectedTests(allTests);
      addToast("Selected all tests", "info");
    } else {
      setSelectedTests([]);
      addToast("Deselected all tests", "info");
    }
  };

  const totalRefund = selectedTests.reduce(
    (sum, test) => sum + parseFloat(test.amount),
    0
  );

  const doctors = [
    { name: "Dr. Prabhu", email: "drprabusankar@smrft.org" },
    { name: "Dr. Priya", email: "drpriya@smrft.org" },
    { name: "Dr. Vaishak", email: "coo@smrft.org" },
  ];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor.name);
    setEmail(doctor.email);
    setOtpSent(false);
    setOtp(""); // Reset OTP when doctor is changed
    addToast(`Selected ${doctor.name} for authorization`, "info");
  };

  const sendOtp = async () => {
    if (!email) {
      setError("Please select a doctor to send OTP.");
      addToast("Please select a doctor to send OTP", "error");
      return;
    }

    // Validate reason
    if (!refundReason.trim()) {
      setError("Please provide a reason for the refund.");
      addToast("Reason for refund is required", "error");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      // Prepare patient and test details
      const patientDetails = patients[0]; // Assuming single patient for now
      const testDetails = selectedTests.map(test => `${test.testname} - ₹${test.amount}`).join(", ");

      const response = await axios.post("https://lab.shinovadatabase.in/generate_otp_refund/", {
        email: email,
        patient_details: {
          patient_id: patientId,
          patient_name: patientDetails.patientname,
          tests: testDetails,
          total_refund_amount: selectedTests.reduce((sum, test) => sum + parseFloat(test.amount), 0),
          reason: refundReason
        }
      });

      addToast(response.data.message, "success");
      setOtpSent(true);
      setIsLoading(false);
    } catch (err) {
      setError("Error sending OTP. Please try again.");
      addToast("Failed to send OTP. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!email || !otp) {
      setError("Email and OTP are required.");
      addToast("Email and OTP are required", "error");
      return;
    }
    if (selectedTests.length === 0) {
      setError("No tests selected for refund.");
      addToast("Please select at least one test for refund", "warning");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post("https://lab.shinovadatabase.in/verify_and_process_refund/", {
        patient_id: patientId,
        selected_tests: selectedTests.map((test) => test.testname),
        email: email,
        otp: otp,
      });

      addToast(response.data.message, "success");
      setSelectedTests([]);
      handleSearch(); // Refresh patient data
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error processing refund. Please try again.";
      setError(errorMessage);
      addToast(errorMessage, "error");
      setIsLoading(false);
    }
  };

  // Get the appropriate icon for toast type
  const getToastIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Refund Billing</Title>
        
        <Card>
          <SectionTitle>Search Patient</SectionTitle>
          <FiltersContainer>
            <FilterGroup>
              <Label>Patient ID</Label>
              <Input 
                type="text" 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)} 
                placeholder="Enter Patient ID" 
              />
            </FilterGroup>
            <FilterGroup>
              <Label>Select Date</Label>
              <Input 
                  type="date" 
                  value={selectDate} 
                  onChange={(e) => setSelectDate(e.target.value)} 
                  max={new Date().toISOString().split("T")[0] !== selectDate ? new Date(Date.now() - 86400000).toISOString().split("T")[0] : undefined}
                />
            </FilterGroup>
          </FiltersContainer>
          <ButtonContainer>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </ButtonContainer>
        </Card>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {patients.length > 0 ? (
          <Card>
            <SectionTitle>Test Selection</SectionTitle>
            <Table>
              <TableHeader>
                <TableCell>
                  <Checkbox
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedTests.length === patients.flatMap((p) =>
                        Array.isArray(p.testname) ? p.testname : JSON.parse(p.testname)
                      ).length
                    }
                  />
                </TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Test Name</TableCell>
                <TableCell>Amount</TableCell>
              </TableHeader>
              
              {patients.map((patient) =>
                (Array.isArray(patient.testname) ? patient.testname : JSON.parse(patient.testname)).map((test, index) => (
                  <TableRow key={`${patient.patient_id}-${index}`}>
                    <TableCell>
                      <Checkbox
                        type="checkbox"
                        checked={selectedTests.some((t) => t.testname === test.testname)}
                        onChange={(e) => handleTestSelection(test, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>{patient.patientname}</TableCell>
                    <TableCell>{test.testname}</TableCell>
                    <TableCell>₹{test.amount}</TableCell>
                  </TableRow>
                ))
              )}
            </Table>

            <TotalContainer>
              <span>Total Refund</span>
              <Badge>₹{totalRefund}</Badge>
            </TotalContainer>

            <SectionTitle style={{ marginTop: '2rem' }}>Authorization</SectionTitle>
            
            <Label>Select Person to Send OTP</Label>
            <RadioContainer>
              {doctors.map((doctor) => (
                <RadioLabel key={doctor.email}>
                  <RadioInput
                    type="radio"
                    name="doctor"
                    value={doctor.name}
                    checked={selectedDoctor === doctor.name}
                    onChange={() => handleDoctorSelect(doctor)}
                  />
                  {doctor.name}
                  {selectedDoctor === doctor.name && <OtpSentBadge sent={otpSent}>{otpSent ? 'OTP Sent' : 'Not Verified'}</OtpSentBadge>}
                </RadioLabel>
              ))}
            </RadioContainer>
            {selectedDoctor && (
              <FilterGroup style={{ marginTop: '1rem' }}>
                <Label>Reason for Refund</Label>
                <Input 
                  type="text" 
                  value={refundReason} 
                  onChange={(e) => setRefundReason(e.target.value)} 
                  placeholder="Enter reason for refund" 
                  maxLength={200}
                />
              </FilterGroup>
            )}

            <FlexContainer>
              <SecondaryButton onClick={sendOtp} disabled={otpSent || !email || isLoading}>
                {isLoading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
              </SecondaryButton>
            </FlexContainer>

            {otpSent && (
              <OTPContainer>
                <Label>Enter OTP</Label>
                <FlexContainer>
                  <Input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="Enter OTP" 
                  />
                  <Button onClick={handleRefund} disabled={!otp || isLoading}>
                    {isLoading ? "Processing..." : "Process Refund"}
                  </Button>
                </FlexContainer>
              </OTPContainer>
            )}
          </Card>
        ) : (
          <Card>
            <EmptyState>
              <p>No records found</p>
              <p>Try searching with a different Patient ID or date</p>
            </EmptyState>
          </Card>
        )}
      </Container>
      
      {/* Toast Container */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type}>
            <ToastIcon>{getToastIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <ToastCloseButton onClick={() => removeToast(toast.id)}>×</ToastCloseButton>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
};

export default Refund;