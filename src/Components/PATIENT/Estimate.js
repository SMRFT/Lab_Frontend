import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 1px;
`;

const ControlsSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
`;

const ToggleLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${(props) => (props.isOn ? "#4CAF50" : "#ccc")};
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${(props) => (props.isOn ? "32px" : "2px")};
    transition: left 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const ToggleStatus = styled.span`
  font-weight: 600;
  color: ${(props) => (props.isB2B ? "#4CAF50" : "#FF6B6B")};
  font-size: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
`;

const DropdownItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TestInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TestName = styled.span`
  font-weight: 600;
  color: #333;
`;

const TestRate = styled.span`
  background: ${(props) => (props.isB2B ? "#E8F5E8" : "#FFE8E8")};
  color: ${(props) => (props.isB2B ? "#2E7D32" : "#C62828")};
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e3f2fd;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: ${(props) => (props.center ? "center" : "left")};
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.95rem;
`;

const TableHeaderCell = styled.th`
  padding: 18px 15px;
  text-align: ${(props) => (props.center ? "center" : "left")};
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const RemoveButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff5252;
  }
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const TotalLabel = styled.h2`
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 300;
`;

const TotalAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: 1px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Estimate = () => {
  // State Management
  const [isB2B, setIsB2B] = useState(false);
  const [testOptions, setTestOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // API Base URL - Replace with your actual base URL
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch test details from API
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Labbaseurl}test_details/`);
        const normalizedData = response.data.map((test, index) => ({
          ...test,
          // Create a unique identifier if _id is missing or not unique
          uniqueId: test._id || `test-${index}-${test.test_name}`,
          test_name: test["test_name"]?.trim() || "",
          shortcut: test.shortcut || "",
        }));
        setTestOptions(normalizedData);
        setFilteredOptions(normalizedData);
      } catch (error) {
        console.error("Error fetching test details:", error);
        toast.error("Failed to load test details");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredOptions(testOptions);
      setShowDropdown(false);
    } else {
      const filtered = testOptions.filter((test) => {
        const testName = test.test_name?.toLowerCase() || "";
        const shortcut = test.shortcut?.toLowerCase() || "";
        const queryLower = query.toLowerCase();

        return testName.includes(queryLower) || shortcut.includes(queryLower);
      });
      setFilteredOptions(filtered);
      setShowDropdown(true);
    }
  };

  // Handle test selection - FIXED VERSION
  const handleTestSelect = (test) => {
    console.log("Selecting test:", test); // Debug log
    console.log("Current selected tests:", selectedTests); // Debug log

    // Use a more robust duplicate checking mechanism
    const isAlreadySelected = selectedTests.some((selectedTest) => {
      // Check multiple possible identifiers
      const sameId = selectedTest.uniqueId === test.uniqueId;
      const sameName = selectedTest.test_name === test.test_name;
      const sameOriginalId =
        selectedTest._id && test._id && selectedTest._id === test._id;

      return sameId || (sameName && sameOriginalId);
    });

    console.log("Is already selected:", isAlreadySelected); // Debug log

    if (!isAlreadySelected) {
      setSelectedTests((prevTests) => {
        const newTests = [...prevTests, test];
        console.log("Updated selected tests:", newTests); // Debug log
        return newTests;
      });
      toast.success(`${test.test_name} added to estimate`);
    } else {
      toast.info(`${test.test_name} is already selected`);
    }

    // Clear search and close dropdown
    setSearchQuery("");
    setShowDropdown(false);
    setFilteredOptions(testOptions);
  };

  // Handle test removal
  const handleRemoveTest = (testId) => {
    setSelectedTests((prevTests) =>
      prevTests.filter((test) => test.uniqueId !== testId)
    );
    toast.success("Test removed from estimate");
  };

  // Calculate total amount
  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => {
      const rate = isB2B ? test.L2L_Rate_Card || 0 : test.MRP || 0;
      return total + rate;
    }, 0);
  };

  // Get rate based on B2B status
  const getRate = (test) => {
    return isB2B ? test.L2L_Rate_Card || 0 : test.MRP || 0;
  };

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Header>
        <Title>Test Rate Estimator</Title>
      </Header>

      <ControlsSection>
        <ToggleContainer>
          <ToggleLabel>Pricing Mode:</ToggleLabel>
          <ToggleSwitch isOn={isB2B} onClick={() => setIsB2B(!isB2B)} />
          <ToggleStatus isB2B={isB2B}>
            {isB2B ? "B2B Rates" : "MRP Rates"}
          </ToggleStatus>
        </ToggleContainer>

        <SearchContainer className="search-container">
          <SearchInput
            type="text"
            placeholder="Search for tests by name or shortcut..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery.trim() && filteredOptions.length > 0) {
                setShowDropdown(true);
              }
            }}
          />

          {showDropdown && filteredOptions.length > 0 && (
            <DropdownContainer>
              {filteredOptions.map((test) => (
                <DropdownItem
                  key={test.uniqueId}
                  onClick={() => handleTestSelect(test)}
                >
                  <TestInfo>
                    <TestName>{test.test_name}</TestName>
                    <TestRate isB2B={isB2B}>₹{getRate(test)}</TestRate>
                  </TestInfo>
                </DropdownItem>
              ))}
            </DropdownContainer>
          )}
        </SearchContainer>
      </ControlsSection>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell center>Sl.No</TableHeaderCell>
                  <TableHeaderCell>Test Name</TableHeaderCell>
                  <TableHeaderCell center>Rate (₹)</TableHeaderCell>
                  <TableHeaderCell center>Action</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {selectedTests.length > 0 ? (
                  selectedTests.map((test, index) => (
                    <TableRow key={test.uniqueId}>
                      <TableCell center>{index + 1}</TableCell>
                      <TableCell>{test.test_name}</TableCell>
                      <TableCell center>
                        <TestRate isB2B={isB2B}>₹{getRate(test)}</TestRate>
                      </TableCell>
                      <TableCell center>
                        <RemoveButton
                          onClick={() => handleRemoveTest(test.uniqueId)}
                        >
                          Remove
                        </RemoveButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4">
                      <EmptyState>
                        No tests selected. Use the search box above to add
                        tests.
                      </EmptyState>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </TableContainer>

          <TotalSection>
            <TotalLabel>Total Estimate</TotalLabel>
            <TotalAmount>₹{calculateTotal().toLocaleString()}</TotalAmount>
          </TotalSection>
        </>
      )}
    </Container>
  );
};

export default Estimate;
