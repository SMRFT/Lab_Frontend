import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch, FaClipboardList, FaEdit, FaSave, FaTimes,FaPlus } from "react-icons/fa";
import TestForm from './TestForm';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modern styled components with responsive design
const Container = styled.div`
  padding: 1rem;
  max-width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const SearchContainer = styled.div`
  left: 200px;
  position: relative;
  width: 350px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 16px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ModernTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #475569;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  tr:nth-child(even) {
    background-color: #f9fafb;
  }
  
  tr:hover {
    background-color: #f1f5f9;
  }
  
  @media (max-width: 1024px) {
    th, td {
      padding: 0.75rem;
    }
  }
`;

const ActionIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #64748b;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3182ce;
    background-color: rgba(49, 130, 206, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s ease;
  
  &:hover {
    color: #2d3748;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.secondary && `
    background-color: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background-color: #f1f5f9;
    }
  `}
  
  ${props => props.primary && `
    background-color: #3182ce;
    color: white;
    border: 1px solid #3182ce;
    
    &:hover {
      background-color: #2c5282;
    }
  `}
`;

const TestName = styled.div`
  margin-bottom: 1rem;
  padding: 0 1.5rem;
  font-size: 1rem;
  color: #4a5568;
`;

const EmptyMessage = styled.td`
  text-align: center;
  padding: 2rem !important;
  color: #718096;
`;

const TestEdit = () => {
  const [testDetails, setTestDetails] = useState([]);
  const [filteredTestDetails, setFilteredTestDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParameters, setSelectedParameters] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestName, setSelectedTestName] = useState("");
  const [showTestForm, setShowTestForm] = useState(false)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // Fetch test details from the backend
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`${Labbaseurl}test_details/`);
        const data = await response.json();
        setTestDetails(data);
        setFilteredTestDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchTestDetails();
  }, []);

  // Search handling
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filteredData = testDetails.filter((test) =>
      test.test_name.toLowerCase().includes(query)
    );
  
    setFilteredTestDetails(filteredData);
    setEditingRow(null);
  };

  const handleParameterClick = (testName, parameters) => {
    if (parameters && parameters.trim() !== "") {
      try {
        const parsedParameters = JSON.parse(parameters);
        setSelectedParameters(parsedParameters);
      } catch (error) {
        setSelectedParameters([]);
      }
    } else {
      setSelectedParameters([]);
    }
    setShowModal(true);
    setSelectedTestName(testName);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedParameters(null);
  };

  const handleEditClick = (index) => {
    setEditingRow(index);
  };

  const handleParameterChange = (index, field, value) => {
    const updatedParameters = [...selectedParameters];
    updatedParameters[index][field] = value;
    setSelectedParameters(updatedParameters);
  };
  
  const handleSaveParameters = async () => {
    try {
      const response = await fetch(`${Labbaseurl}test_details/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_name: selectedTestName,
          parameters: selectedParameters,
        }),
      });
  
      if (response.ok) {
        toast.success("Parameters updated successfully!");
        setShowModal(false);
        setSelectedParameters(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update parameters");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating parameters");
    }
  };  

  const handleSaveClick = async (index) => {
    const updatedTest = filteredTestDetails[index];

    try {
      const response = await fetch(`${Labbaseurl}test_details_test/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_name: updatedTest.test_name,
          shortcut: updatedTest.shortcut, 
          department: updatedTest.department,
          collection_container: updatedTest.collection_container,
          method: updatedTest.method,
          reference_range: updatedTest.reference_range,
          unit: updatedTest.unit,
        }),
      });

      if (response.ok) {
        toast.success("Test updated successfully!");

        const originalIndex = testDetails.findIndex(
          (test) => test.test_name === updatedTest.test_name
        );
        if (originalIndex !== -1) {
          const updatedTestDetails = [...testDetails];
          updatedTestDetails[originalIndex] = { ...updatedTest };
          setTestDetails(updatedTestDetails);
        }

        setEditingRow(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error updating test details");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating test details");
    }
  };
  
  const handleInputChange = (e, index, field) => {
    const updatedFilteredTestDetails = [...filteredTestDetails];
    updatedFilteredTestDetails[index][field] = e.target.value;
  
    setFilteredTestDetails(updatedFilteredTestDetails);
  
    const originalIndex = testDetails.findIndex(
      (test) => test.test_name === filteredTestDetails[index].test_name
    );
    if (originalIndex !== -1) {
      const updatedTestDetails = [...testDetails];
      updatedTestDetails[originalIndex][field] = e.target.value;
      setTestDetails(updatedTestDetails);
    }
  };

  if (loading) {
    return (
      <Container>
        <div>Loading test details...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Test Details</Title>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search Test Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        <button onClick={() => setShowTestForm(true)}>
          <FaPlus size={16} />
        </button>
      </Header>

      <TableWrapper>
        <ModernTable>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Shortcut</th>
              <th>Department</th>
              <th>Collection Container</th>
              <th>Method</th>
              <th>Reference Range</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestDetails.length > 0 ? (
              filteredTestDetails.map((test, index) => (
                <tr key={index}>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.test_name}
                        onChange={(e) => handleInputChange(e, index, "test_name")}
                      />
                    ) : (
                      test.test_name
                    )}
                  </td>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.shortcut}
                        onChange={(e) => handleInputChange(e, index, "shortcut")}
                      />
                    ) : (
                      test.shortcut
                    )}
                  </td>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.department}
                        onChange={(e) => handleInputChange(e, index, "department")}
                      />
                    ) : (
                      test.department
                    )}
                  </td>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.collection_container}
                        onChange={(e) => handleInputChange(e, index, "collection_container")}
                      />
                    ) : (
                      test.collection_container
                    )}
                  </td>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.method}
                        onChange={(e) => handleInputChange(e, index, "method")}
                      />
                    ) : (
                      test.method
                    )}
                  </td>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.reference_range}
                        onChange={(e) => handleInputChange(e, index, "reference_range")}
                      />
                    ) : (
                      test.reference_range
                    )}
                  </td>
                  <td>
                    {editingRow === index ? (
                      <Input
                        type="text"
                        value={test.unit}
                        onChange={(e) => handleInputChange(e, index, "unit")}
                      />
                    ) : (
                      test.unit
                    )}
                  </td>
                  <td>
                    <ActionIcons>
                      <IconButton
                        onClick={() => handleParameterClick(test.test_name, test.parameters)}
                        title="View Parameters"
                      >
                        <FaClipboardList />
                      </IconButton>
                      
                      {editingRow === index ? (
                        <IconButton
                          onClick={() => handleSaveClick(index)}
                          title="Save Changes"
                        >
                          <FaSave />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleEditClick(index)}
                          title="Edit Test"
                        >
                          <FaEdit />
                        </IconButton>
                      )}
                    </ActionIcons>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <EmptyMessage colSpan="8">
                  No test details available.
                </EmptyMessage>
              </tr>
            )}
          </tbody>
        </ModernTable>
      </TableWrapper>

      {/* Modal for parameters */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Parameters</ModalTitle>
              <ModalCloseButton onClick={handleCloseModal}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            
            <TestName>Test Name: {selectedTestName}</TestName>
            
            <ModalBody>
              {selectedParameters && selectedParameters.length > 0 ? (
                <TableWrapper>
                  <ModernTable>
                    <thead>
                      <tr>
                        <th>Test Name</th>
                        <th>Department</th>
                        <th>Unit</th>
                        <th>Reference Range</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedParameters.map((param, index) => (
                        <tr key={index}>
                          <td>
                            <Input
                              type="text"
                              value={param.test_name}
                              onChange={(e) => handleParameterChange(index, "test_name", e.target.value)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={param.department}
                              onChange={(e) => handleParameterChange(index, "department", e.target.value)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={param.unit}
                              onChange={(e) => handleParameterChange(index, "unit", e.target.value)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={param.reference_range}
                              onChange={(e) => handleParameterChange(index, "reference_range", e.target.value)}
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={param.method}
                              onChange={(e) => handleParameterChange(index, "method", e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ModernTable>
                </TableWrapper>
              ) : (
                <p>No parameters available</p>
              )}
            </ModalBody>
            
            <ModalFooter>
              <Button secondary onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button primary onClick={handleSaveParameters}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
       {/* Test Form Modal */}
      <TestForm show={showTestForm} setShow={setShowTestForm} />
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Container>
  );
};

export default TestEdit;
