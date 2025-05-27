import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { faTimes, faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from 'date-fns';
import JsBarcode from 'jsbarcode'; // Import JsBarcode
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import headerImage from '../Images/Header.png';
import FooterImage from '../Images/Footer.png';
import Savitha from '../Images/Savitha.png';
import Vijayan from '../Images/Vijayan.png';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { X, Printer, Download, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  width: 70%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #DB9BB9;
    box-shadow: 0 0 0 2px rgba(219, 155, 185, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const TestList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 10px 0;
  padding-right: 10px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #DB9BB9;
    border-radius: 10px;
  }
`;

const TestItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9f0f4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const TestInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid ${props => props.checked ? '#DB9BB9' : '#d1d1d1'};
  border-radius: 6px;
  margin-right: 15px;
  transition: all 0.2s;
  background: ${props => props.checked ? '#DB9BB9' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    border-color: #DB9BB9;
  }
`;

const TestName = styled.span`
  font-size: 15px;
  color: #333;
  font-weight: ${props => props.selected ? '600' : '400'};
`;

const TestNumber = styled.span`
  font-size: 13px;
  color: #888;
  margin-left: 8px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.primary && `
    background-color: #DB9BB9;
    color: white;
    
    &:hover {
      background-color: #c985a7;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${props => props.secondary && `
    background-color: #f5f5f5;
    color: #333;
    
    &:hover {
      background-color: #e9e9e9;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SelectedCount = styled.div`
  background-color: #f0f0f0;
  color: #555;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  margin-left: 10px;
`;

const PrintOptions = styled.div`
  position: absolute;
  bottom: 70px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  transition: all 0.3s;
  transform-origin: bottom right;
  transform: ${props => props.show ? 'scale(1)' : 'scale(0)'};
  opacity: ${props => props.show ? '1' : '0'};
`;

const PrintOption = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: #f9f0f4;
  }
`;

// **Main Component**
const TestSorting = ({ patient, onClose }) => {
    const [tests, setTests] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const verified_by = localStorage.getItem('name');
    const [showPrintOptions, setShowPrintOptions] = useState(false);
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        axios.get(`${Labbaseurl}patient_test_sorting/`, {
            params: { patient_id: patient.patient_id, date: patient.date },
        })
        .then((response) => {
            if (response.data[patient.patient_id]) {
                const testDetails = response.data[patient.patient_id].testdetails || [];
                
                // Order by number (assumes test name contains a number)
                const sortedTests = testDetails.sort((a, b) => {
                    const numA = parseInt(a.testname.match(/\d+/)?.[0]) || 0;
                    const numB = parseInt(b.testname.match(/\d+/)?.[0]) || 0;
                    return numA - numB;
                });

                setTests(sortedTests.map(test => ({ testname: test.testname })));
            }
        })
        .catch((error) => console.error("Error fetching tests:", error));
    }, [patient.patient_id]);

    const handleSelectTest = (test) => {
        setSelectedTests((prev) => {
            const isSelected = prev.some((t) => t.testname === test.testname);
            return isSelected ? prev.filter((t) => t.testname !== test.testname) : [...prev, test];
        });
    };

    const handleSelectAll = () => {
        if (selectAllChecked) {
            setSelectedTests([]);
        } else {
            setSelectedTests([...tests]);
        }
        setSelectAllChecked(!selectAllChecked);
    };

    const handlePrint = async (withLetterpad) => {
        if (!selectedTests.length) {
            alert("Please select at least one test to print.");
            return;
        }

        try {
            const response = await axios.get(
                `${Labbaseurl}get_patient_test_details/?patient_id=${patient.patient_id}`
            );
            const patientDetails = response.data;

            const orderedTests = selectedTests.map(test => 
                patientDetails.testdetails.find(t => t.testname === test.testname)
            ).filter(test => test); // Ensure no undefined values
            

    const doc = new jsPDF();
    // Add header image if 'withLetterpad' is true
    if (withLetterpad) {
      doc.addImage(headerImage, "PNG", 10, 10, 190, 30); // x, y, width, height
      doc.addImage(FooterImage, "PNG", 10, doc.internal.pageSize.height - 20, 190, 15); // Footer placement
    }
    // Function to extract the number from patient_ref_no
    const extractPatientRefNoNumber = (refNo) => {
      const numberPart = refNo.split('+')[0];
      return numberPart;
    };
    // Adding Consultant names and qualifications
    const consultants = [
      ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
      ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
      ["Dr. R. VIJAYAN Ph.D.", "Consultant Biochemist", Vijayan],
    ];
    const patientRefNo = patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A";
    const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo);
    // Generate Barcode
    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, patientRefNoNumber, {
      format: "CODE128",
      lineColor: "#000",
      width: 1.5,
      height: 10,
      displayValue: false,
      margin: 0,
    });
    const barcodeImage = barcodeCanvas.toDataURL("image/png");
    const headerHeight = 40; // Height of the header
    const contentYStart = headerHeight + 10; // Start content below the header
    // Patient information (left and right sides)
    const leftDetails = [
      { label: "Reg.ID", value: patient.patient_id || "N/A" },
      { label: "Patient Name", value: patientDetails.patientname || "No name provided" },
      { label: "Age/Gender", value: `${patient.age || "N/A"} ${patient.gender || "N/A"}` },
      { label: "Referral", value: patient.refby || "SELF" },
      { label: "Source", value: patient.B2B || "N/A" },
    ];
    const rightDetails = [
      { label: "Collected On", value: format(new Date(patientDetails.testdetails[0].samplecollected_time), "dd MMM yy/HH:mm") || "N/A" },
      { label: "Received On", value: format(new Date(patientDetails.testdetails[0].received_time), "dd MMM yy/HH:mm") || "N/A" },
      { label: "Reported Date", value: format(new Date(), "dd MMM yy/HH:mm") },
      { label: "Patient Ref.No", value: patientRefNoNumber }
    ];
    const calculateMaxLabelWidth = (details) => {
      return Math.max(...details.map((item) => doc.getTextWidth(item.label)));
    };
    let yPosition = 50;
    const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails);
    const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails);
    let currentYPosition = contentYStart;
    // Adjust content to start below the header
    // Add Patient Ref.No and barcode image
    const leftLabelX = 20;
    const leftColonX = leftLabelX + leftMaxLabelWidth + 2; // Adding 2 for spacing
    const leftValueX = leftColonX + 5; // Consistent spacing after colon
    const rightLabelX = 120;
    const rightColonX = rightLabelX + rightMaxLabelWidth + 2;
    const rightValueX = rightColonX + 5;
    for (let i = 0; i < leftDetails.length; i++) {
      const left = leftDetails[i];
      const right = rightDetails[i];
      // Left Side
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(left.label, leftLabelX, currentYPosition);
      doc.text(":", leftColonX, currentYPosition); // Colon after label
      doc.setFont("helvetica", "normal");
      doc.text(left.value, leftValueX, currentYPosition);
      if (right) {
        // Right Side
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(right.label, rightLabelX, currentYPosition);
        doc.text(":", rightColonX, currentYPosition);
        doc.setFont("helvetica", "normal");
        doc.text(right.value, rightValueX, currentYPosition);
        if (right.label === "Patient Ref.No") {
          currentYPosition += 3;
          doc.addImage(barcodeImage, "PNG", 164, currentYPosition, 30, 10);
        }
      }
      currentYPosition += 6; // Move to the next row
    }
            
    const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight) => {
        const splitText = doc.splitTextToSize(text, maxWidth);
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight);
        });
        return splitText.length * lineHeight; // Return total height used
      };

            orderedTests.sort((a, b) => {
                const indexA = selectedTests.findIndex(t => t.testname === a.testname);
                const indexB = selectedTests.findIndex(t => t.testname === b.testname);
                return indexA - indexB;
            });
    
      
            if (orderedTests.length) {

            const pageWidth = 190;
            const startX = 10;
            
            // Updated column widths
            const colWidths = [pageWidth * 0.4, pageWidth * 0.15, pageWidth * 0.15, pageWidth * 0.15, pageWidth * 0.15]; 
          
            let yPos = currentYPosition;
          
            // **Draw Top Line**
            yPos += 5;
            doc.line(startX, yPos, startX + pageWidth, yPos);
            yPos += 5;
          
            // **Table Header (Centered)**
            doc.setFontSize(10);
            doc.setFont("helvetica");
            const headers = ["Test Description", "Specimen Type", "Value(s)", "Unit", "Reference Range"];
            headers.forEach((header, index) => {
              doc.text(header, startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0), yPos, { align: "left" });
            });
            yPos += 5; // Move down after header
          
            // **Draw Bottom Line**
            doc.line(startX, yPos, startX + pageWidth, yPos);
            yPos += 5;
          
            // **Group Tests by Department**
            const testsByDepartment = orderedTests.reduce((acc, test) => {
              (acc[test.department] = acc[test.department] || []).push(test);
              return acc;
            }, {});
          
            Object.keys(testsByDepartment).forEach((department) => {
              // **Department Title with Underline**
              doc.setFont("helvetica", "bold");
              doc.setFontSize(11);
              let textWidth = doc.getTextWidth(department.toUpperCase());
              let departmentY = yPos + 6; // Center department name between lines
          
              doc.text(department.toUpperCase(), pageWidth / 2, departmentY, { align: "center" });
              doc.line((pageWidth / 2) - (textWidth / 2), departmentY + 2, (pageWidth / 2) + (textWidth / 2), departmentY + 2);
          
              yPos += 15; // Space after heading
          
              // **Print each test in the department**
              testsByDepartment[department].forEach((test) => {
                doc.setFontSize(9);
                doc.setFont("helvetica");
          
                // **Test Description (Wrapped into 3 or more lines)**
                const testNameHeight = wrapText(doc, test.testname, colWidths[0], startX, yPos, 5);
          
                // **Specimen Type (Aligned with Header, Reset Font to Normal)**
                doc.setFont("helvetica", "normal");
                doc.text(test.specimen_type, startX + colWidths[0], yPos);
          
                // **Determine Value with High/Low Indicator**
                let valueText = test.value ? test.value.toString() : ""; // Ensure it's a string
                let prefix = "";
                if (test.isHigh === true) prefix = "H "; // If test.isHigh is true, add "H "
                else if (test.isLow === true) prefix = "L "; // If test.isLow is true, add "L "
          
                // **Apply Bold Formatting to H/L + Value**
                doc.setFont("helvetica", "bold");
                doc.text(`${prefix}${valueText}`, startX + colWidths[0] + colWidths[1], yPos);
          
                // **Reset font back to normal**
                doc.setFont("helvetica", "normal");
          
                // **Unit**
                doc.text(test.unit, startX + colWidths[0] + colWidths[1] + colWidths[2], yPos);
          
                // **Reference Range (Wrapped)**
                const referenceRangeHeight = wrapText(doc, test.reference_range, colWidths[4], startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], yPos, 5);
          
            // Move to next line
            yPos += Math.max(testNameHeight, referenceRangeHeight) + 3; 
      
            // **Method (Italicized and Gray)**
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(128, 128, 128); // Gray color
            doc.text(`Method: ${test.method}`, startX + 5, yPos);
            doc.setTextColor(0, 0, 0); // Reset to black
            yPos += 8; 
          });
          
              yPos += 10; // Space between departments
            });
          
            currentYPosition = yPos;
          }
      
                    
            doc.setFontSize(12);
            doc.setFont("helvetica");
            doc.setTextColor(0, 0, 0);
            doc.text("**End Of Report**", 105, currentYPosition, { align: "center" });
            yPosition = currentYPosition + 10;
            doc.setFont("helvetica", "normal");
            doc.text(`Verified by: ${verified_by}`, 10, yPosition);
            // Loop through the consultants and add their names side by side
            const startX = 20; // Starting X position for the first consultant
            let yPositionForConsultants = currentYPosition + 50; // Start below the previous section
            // Loop through the consultants and add their signatures, names, and qualifications
            consultants.forEach((consultant, index) => {
              const xPosition = startX + index * 60; // Spacing between consultants
              // Add Signature (if available)
              if (consultant[2]) {
                doc.addImage(consultant[2], "PNG", xPosition, yPositionForConsultants, 40, 15); // Increased size of the signature
              }
              // Print first line (name and degree) below the signature
              doc.setFont("helvetica", "bold");
              doc.text(consultant[0], xPosition, yPositionForConsultants + 15); // Name below the signature
              // Print second line (qualification) below the name
              doc.setFont("helvetica", "normal");
              doc.text(consultant[1], xPosition, yPositionForConsultants + 21); // Qualification below the name
            });
            // Generate the PDF as a Blob
            const pdfBlob = doc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
        
            // Open the PDF in a new tab for preview (without downloading)
            window.open(pdfUrl, "_blank");
          } catch (error) {
            console.error("Error while generating the PDF:", error);
          }
        };
        
        const filteredTests = tests.filter(test => 
          test.testname.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // Extract test number for display
      const extractTestNumber = (testname) => {
          const match = testname.match(/\d+/);
          return match ? match[0] : '';
      };
        return (
          <ModalOverlay>
              <ModalContent>
                  <ModalHeader>
                      <Title>Sort and Select Tests</Title>
                  </ModalHeader>
                  
                  <SearchContainer>
                      <SearchInput
                          type="text"
                          placeholder="Search tests..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <SearchIcon>
                          <Search size={18} />
                      </SearchIcon>
                  </SearchContainer>
                  
                  <SelectAllContainer>
                      <CheckboxContainer 
                          checked={selectAllChecked}
                          onClick={handleSelectAll}
                      >
                          {selectAllChecked && <Check size={14} color="white" />}
                      </CheckboxContainer>
                      <span>Select All</span>
                      {selectedTests.length > 0 && (
                          <SelectedCount>{selectedTests.length} selected</SelectedCount>
                      )}
                  </SelectAllContainer>
                  
                  <TestList>
                      {filteredTests.length === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                              No tests found matching your search
                          </div>
                      ) : (
                          filteredTests.map((test) => {
                              const isSelected = selectedTests.some((t) => t.testname === test.testname);
                              const testNumber = extractTestNumber(test.testname);
                              
                              return (
                                  <TestItem 
                                      key={test.testname}
                                      onClick={() => handleSelectTest(test)}
                                  >
                                      <TestInfo>
                                          <CheckboxContainer checked={isSelected}>
                                              {isSelected && <Check size={14} color="white" />}
                                          </CheckboxContainer>
                                          <TestName selected={isSelected}>
                                              {test.testname}
                                              {testNumber && <TestNumber>#{testNumber}</TestNumber>}
                                          </TestName>
                                      </TestInfo>
                                  </TestItem>
                              );
                          })
                      )}
                  </TestList>
                  
                  <ModalFooter>
                      <Button 
                          secondary 
                          onClick={onClose}
                      >
                          <X size={16} />
                          Close
                      </Button>
                      
                      <ButtonGroup>
                          <Button 
                              primary
                              disabled={selectedTests.length === 0}
                              onClick={() => setShowPrintOptions(!showPrintOptions)}
                          >
                              <Printer size={16} />
                              Print Options
                              {showPrintOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </Button>
                          
                          <PrintOptions show={showPrintOptions}>
                              <PrintOption onClick={() => handlePrint(true)}>
                                  <Printer size={16} />
                                  Print with Letterhead
                              </PrintOption>
                              <PrintOption onClick={() => handlePrint(false)}>
                                  <Printer size={16} />
                                  Print without Letterhead
                              </PrintOption>
                          </PrintOptions>
                      </ButtonGroup>
                  </ModalFooter>
              </ModalContent>
          </ModalOverlay>
      );
  };
  
  export default TestSorting;