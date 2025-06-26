import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ArrowLeft, Save, Edit, Check } from 'lucide-react';

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
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

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
 
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
 
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: var(--dark);
  font-weight: 600;
 
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
 
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InfoItem = styled.div`
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
 
  span {
    font-weight: 600;
    margin-right: 0.5rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
 
  &:hover {
    background-color: var(--primary-light);
  }
 
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const BackButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);
 
  &:hover {
    background-color: var(--gray-light);
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--success);
 
  &:hover {
    background-color: var(--info);
  }
`;

const EditButton = styled(Button)`
  background-color: var(--secondary);
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
 
  &:hover {
    background-color: var(--primary);
  }
`;

const UpdateButton = styled(Button)`
  background-color: var(--success);
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
 
  &:hover {
    background-color: var(--info);
  }
`;

const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  font-size: 1.125rem;
  color: var(--gray);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TestCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;

const TestHeader = styled.div`
  background-color: var(--primary);
  color: white;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
`;

const TestContent = styled.div`
  padding: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
 
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
 
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
 
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  min-height: 100px;
  resize: vertical;
 
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const ParameterSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid var(--gray-light);
  padding-top: 1.5rem;
`;

const ParameterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--secondary);
`;

const ParameterCard = styled.div`
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

function TestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [values, setValues] = useState({});
  const [remarks, setRemarks] = useState({});
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');
 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patient_id');
  const date = queryParams.get('date');
  const barcode = queryParams.get('barcode');
  const testName = queryParams.get('test_name');
  const navigate = useNavigate();
  const verified_by = localStorage.getItem('name') || "";
  // console.log('Verified By:', verified_by);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    if (patientId && date && testName) {
      fetchTestDetails(patientId, date, testName);
    } else {
      setLoading(false);
    }
  }, [patientId, date, testName]);
 
  const fetchTestDetails = async (patientId, selectedDate, testName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Labbaseurl}compare_test_details/?patient_id=${patientId}&date=${selectedDate}`
      );
     
      // Debug the response data structure
      // console.log("Test details response:", response.data);
     
      const allTests = response.data.data || [];
      const filteredTests = allTests.filter((test) => test.testname === testName);
     
      // console.log("Filtered tests:", filteredTests);
 
      setTestDetails(filteredTests);
 
      let tempValues = {};
      let tempEditMode = {};
 
      filteredTests.forEach((test) => {
        tempValues[test.testname] = test.value || '';
 
        if (test.parameters && Array.isArray(test.parameters)) {
          test.parameters.forEach((param) => {
            // Use consistent naming for parameter keys
            const paramName = param.name || param.test_name;
            tempValues[`${test.testname}_${paramName}`] = param.value || '';
          });
        }
 
        tempEditMode[test.testname] = false;
      });
 
      setValues(tempValues);
      setEditMode(tempEditMode);
     
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test details:', error);
      setError('Failed to load test details. Please try again.');
      setLoading(false);
    }
  };

  const handleValueChange = (testname, event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [testname]: event.target.value,
    }));
  };  

  const handleParameterValueChange = (testname, paramName, event) => {
    const { value } = event.target;
    const uniqueKey = `${testname}_${paramName}`;
   
    // console.log(`Setting parameter value for ${uniqueKey} to ${value}`);
   
    setValues((prevValues) => ({
      ...prevValues,
      [uniqueKey]: value,
    }));
  };
     
  const handleRemarksChange = (testname, event) => {
    setRemarks((prevRemarks) => ({ ...prevRemarks, [testname]: event.target.value }));
  };

  const toggleEditMode = (testname) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [testname]: !prevEditMode[testname],
    }));
  };

  const handleUpdate = async (testname) => {
    try {
      const updatedTestDetails = testDetails.map((test) => {
        if (test.testname === testname) {
          return {
            ...test,
            value: values[test.testname],
            remarks: remarks[test.testname],
            rerun: false, // Set rerun to false when updating
          };
        }
        return test;
      });
      const payload = {
        patient_id: patientId,
        date: date,
        testdetails: updatedTestDetails,
        verified_by: verified_by
      };
      await axios.patch(`${Labbaseurl}test-value/update/`, payload);
      alert('Test details updated successfully!');
      toggleEditMode(testname);
    } catch (error) {
      console.error('Error updating test details:', error);
      alert('Failed to update test details.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Current test details:", testDetails);
   
    const testDetailsData = testDetails.map((test) => {
      if (test.parameters && Array.isArray(test.parameters) && test.parameters.length > 0) {
        return {
          testname: test.testname,
          rerun: false,
          approve: false,
          approve_time: "null",
          dispatch: false,
          dispatch_time: "null",
          department: test.department || 'N/A',
          parameters: test.parameters.map((param) => {
            // Handle both name formats (name or test_name)
            const paramName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${paramName}`;
           
            // console.log(`Processing parameter ${paramName}, value: ${values[uniqueKey]}`);
           
            return {
              name: paramName,
              value: values[uniqueKey] || '',
              unit: param.unit || 'N/A',
              specimen_type: test.specimen_type || 'N/A',
              reference_range: param.reference_range || 'N/A',
              method: param.method || '',
            };
          }),
        };
      } else {
        return {
          testname: test.testname,
          specimen_type: test.specimen_type || 'N/A',
          value: values[test.testname] || '',
          unit: test.unit || 'N/A',
          reference_range: test.reference_range || 'N/A',
          method: test.method || '',
          department: test.department || '',
          rerun: false,
          approve: false,
          approve_time: "null",
          dispatch: false,
          dispatch_time: "null",
        };
      }
    });
   
    const payload = {
      patient_id: patientId,
      date: date,
      barcode: barcode,
      testdetails: testDetailsData,
      verified_by: verified_by,
    };
   
    // console.log("Submitting payload:", payload);
   
    try {
      const response = await axios.patch(`${Labbaseurl}test-value/save/`, payload);
      alert(response.data.message || 'Test details updated successfully!');
      fetchTestDetails(patientId, date, testName);
    } catch (patchError) {
      console.error('Patch error:', patchError);
     
      if (patchError.response && patchError.response.status === 404) {
        try {
          // console.log("Record not found, trying POST instead");
          const postResponse = await axios.post(`${Labbaseurl}test-value/save/`, payload);
          alert(postResponse.data.message || 'Test details saved successfully!');
          fetchTestDetails(patientId, date, testName);
        } catch (postError) {
          console.error('Error saving test details:', postError);
          alert('Failed to save test details.');
        }
      } else {
        console.error('Error updating test details:', patchError);
        alert('Failed to update test details.');
      }
    }
  };
 
  const fetchTestValue = async (patientId, date, testname) => {
    try {
      const response = await axios.get(`${Labbaseurl}test-value/save/`, {
        params: { patient_id: patientId, date: date, testname: testname },
      });
 
      // console.log(`Fetched test value for ${testname}:`, response.data);
     
      const testData = response.data;
 
      if (testData.value) {
        setValues((prevValues) => ({
          ...prevValues,
          [testData.testname]: testData.value,
        }));
      }
 
      if (testData.parameters && Array.isArray(testData.parameters)) {
        testData.parameters.forEach((param) => {
          // Handle both name formats
          const paramName = param.name || param.test_name;
          const uniqueKey = `${testData.testname}_${paramName}`;
         
          // console.log(`Setting value for parameter ${paramName}: ${param.value}`);
         
          setValues((prevValues) => ({
            ...prevValues,
            [uniqueKey]: param.value || '',
          }));
        });
      }
    } catch (error) {
      console.error('Error fetching test value:', error);
    }
  };
 
  useEffect(() => {
    if (patientId && date) {
      testDetails.forEach((test) => {
        fetchTestValue(patientId, date, test.testname);
      });
    }
  }, [patientId, date, testDetails]);

  const handleBack = () => {
    navigate('/PatientDetails');
  };
 
  if (loading) {
    return (
      <Container>
        <GlobalStyle />
        <div>Loading test details...</div>
      </Container>
    );
  }
 
  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <div>{error}</div>
      </Container>
    );
  }
 
  return (
    <Container>
      <GlobalStyle />
      <Header>
        <Title>Test Details</Title>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Patient Details
        </BackButton>
      </Header>
     
      {patientId && (
        <PatientInfo>
          <InfoItem>
            <span>Patient ID:</span> {patientId}
          </InfoItem>
          {patientName && (
            <InfoItem>
              <span>Patient Name:</span> {patientName}
            </InfoItem>
          )}
          {date && (
            <InfoItem>
              <span>Date:</span> {date}
            </InfoItem>
          )}
          {barcode && (
            <InfoItem>
              <span>Barcode:</span> {barcode}
            </InfoItem>
          )}
        </PatientInfo>
      )}

      {testDetails.length === 0 ? (
        <NoData>No test details available for the selected patient.</NoData>
      ) : (
        <Form onSubmit={handleSubmit}>
          {testDetails.map((test, index) => (
            <TestCard key={index}>
              <TestHeader>{test.testname}</TestHeader>
              <TestContent>
                {/* Test without parameters */}
                {!test.parameters || !Array.isArray(test.parameters) || test.parameters.length === 0 ? (
                  <>
                    <FormRow>
                      <FormGroup>
                        <Label>Specimen Type</Label>
                        <Input type="text" value={test.specimen_type || 'N/A'} disabled />
                      </FormGroup>
                      <FormGroup>
                        <Label>Unit</Label>
                        <Input type="text" value={test.unit || 'N/A'} disabled />
                      </FormGroup>
                      <FormGroup>
                        <Label>Reference Range</Label>
                        <Input type="text" value={test.reference_range || 'N/A'} disabled />
                      </FormGroup>
                    </FormRow>
                   
                    <FormRow>
                      <FormGroup>
                        <Label>Value</Label>
                        <Input
                          type="text"
                          value={values[test.testname] || ''}
                          onChange={(e) => handleValueChange(test.testname, e)}
                          placeholder="Enter value"
                        />
                      </FormGroup>
                     
                      {editMode[test.testname] ? (
                        <FormGroup>
                          <Label>Remarks</Label>
                          <TextArea
                            value={remarks[test.testname] || ''}
                            onChange={(e) => handleRemarksChange(test.testname, e)}
                            placeholder="Enter remarks"
                          />
                        </FormGroup>
                      ) : null}
                     
                      <FormGroup style={{ alignSelf: 'flex-end' }}>
                        {editMode[test.testname] ? (
                          <UpdateButton
                            type="button"
                            onClick={() => handleUpdate(test.testname)}
                          >
                            <Check size={16} />
                            Update
                          </UpdateButton>
                        ) : (
                          <EditButton
                            type="button"
                            onClick={() => toggleEditMode(test.testname)}
                          >
                            <Edit size={16} />
                            Edit Remarks
                          </EditButton>
                        )}
                      </FormGroup>
                    </FormRow>
                  </>
                ) : null}
               
                {/* Render Parameters */}
                {test.parameters && Array.isArray(test.parameters) && test.parameters.length > 0 && (
                  <ParameterSection>
                    <ParameterTitle>Parameters</ParameterTitle>
                   
                    {test.parameters.map((param, paramIndex) => {
                      // Handle both name formats
                      const paramName = param.name || param.test_name;
                      const uniqueKey = `${test.testname}_${paramName}`;
                     
                      // console.log(`Rendering parameter: ${paramName}, uniqueKey: ${uniqueKey}, value: ${values[uniqueKey]}`);
                     
                      return (
                        <ParameterCard key={`${uniqueKey}-${paramIndex}`}>
                          <FormRow>
                            <FormGroup>
                              <Label>Parameter Name</Label>
                              <Input type="text" value={paramName} disabled />
                            </FormGroup>
                            <FormGroup>
                              <Label>Specimen Type</Label>
                              <Input type="text" value={test.specimen_type || 'N/A'} disabled />
                            </FormGroup>

                            <FormGroup>
                              <Label>Value</Label>
                              <Input
                                type="text"
                                value={values[uniqueKey] || ''}
                                onChange={(e) => handleParameterValueChange(test.testname, paramName, e)}
                                placeholder="Enter value"
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label>Unit</Label>
                              <Input type="text" value={param.unit || 'N/A'} disabled />
                            </FormGroup>
                            <FormGroup>
                              <Label>Reference Range</Label>
                              <Input type="text" value={param.reference_range || 'N/A'} disabled />
                            </FormGroup>
                          </FormRow>
                        </ParameterCard>
                      );
                    })}
                  </ParameterSection>
                )}
              </TestContent>
            </TestCard>
          ))}
         
          <ButtonContainer>
            <SaveButton type="submit">
              <Save size={18} />
              Save Test Details
            </SaveButton>
          </ButtonContainer>
        </Form>
      )}
    </Container>
  );
}

export default TestDetails;