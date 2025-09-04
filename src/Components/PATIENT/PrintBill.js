import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import styled from "styled-components";
import { Search, Printer } from "lucide-react";
import { format } from "date-fns";
import headerImage from "../Images/Header.png";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 15px;

  @media (min-width: 768px) {
    align-items: center;
  }
`;

const DateFilterContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;

  .react-datepicker-wrapper {
    width: auto;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-left: auto;

  input {
    width: 100%;
    padding: 10px 40px 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
  }

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const PrintButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;

  button {
    padding: 8px 12px;
    border: 1px solid #ccc;
    background: #f0f4f8;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    color: #333;

    &:hover {
      background: #e2e8f0;
    }

    &.active {
      background: linear-gradient(135deg, #a9d1ea, #e68fae, #7d2378);
      color: white;
      border-color: transparent;
    }

    &:disabled {
      background: #f1f5f9;
      cursor: not-allowed;
      color: #a0aec0;
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PrintBill = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientsPerPage] = useState(15);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    fetchPatients();
  }, [startDate, endDate]);

const fetchPatients = async () => {
  try {
    const response = await axios.get(
      `${Labbaseurl}patients/?start_date=${
        startDate.toISOString().split("T")[0]
      }&end_date=${endDate.toISOString().split("T")[0]}`
    );
    console.log("API Response:", response.data);  // :point_left: Add this

      const data = response.data.data;
      if (Array.isArray(data)) {
        // Process patients data - ensure testname is parsed from JSON if it's a string
        const processedData = data.map((patient) => {
          // If testname is a string, parse it to an array
          if (typeof patient.testname === "string") {
            try {
              patient.testname = JSON.parse(patient.testname);
            } catch (e) {
              console.error("Error parsing testname JSON:", e);
              patient.testname = [];
            }
          }

          // Ensure any other JSON fields are parsed
          if (typeof patient.payment_method === "string") {
            try {
              patient.payment_method = JSON.parse(patient.payment_method);
            } catch (e) {
              console.error("Error parsing payment_method JSON:", e);
              patient.payment_method = {};
            }
          }

          return patient;
        });

        setPatients(processedData);
        setCurrentPage(1); // Reset to first page when new data is fetched
      } else {
        console.error("Invalid data format:", data);
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    }
  };

  const handlePrint = (patient) => {
    // Convert number to words for amount
    const numberToWords = (num) => {
      const a = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];
      const toWords = (n) => {
        if (n < 20) return a[n];
        if (n < 100)
          return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
        if (n < 1000)
          return (
            a[Math.floor(n / 100)] +
            " Hundred" +
            (n % 100 ? " and " + toWords(n % 100) : "")
          );
        return (
          toWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + toWords(n % 1000) : "")
        );
      };
      return toWords(parseInt(num));
    };

    // Ensure we're working with an array of tests and filter out refunded/cancelled tests
    const validTests = Array.isArray(patient.testname)
      ? patient.testname.filter((test) => !test.refund && !test.cancellation)
      : [];

    // Create table rows for valid tests only
    const tableRows = validTests
      .map(
        (test, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${test.testname}</td>
          <td style="text-align: right;">${parseFloat(test.amount || 0).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");
    // FIXED: Better payment method handling
    let displayPaymentMode = "NIL";

    // First, check if payment_method is a string (current form state)
    if (patient.payment_method && typeof patient.payment_method === "string") {
      displayPaymentMode = patient.payment_method;

      // Add payment details if available and not Cash
      if (patient.payment_method !== "Cash" && patient.payment_detail) {
        displayPaymentMode += ` (${patient.payment_detail})`;
      }

      // Handle PartialPayment special case
      if (
        patient.payment_method === "PartialPayment" &&
        patient.PartialPayment?.method
      ) {
        displayPaymentMode = `Partial Payment - ${patient.PartialPayment.method}`;
        if (patient.PartialPayment.credit) {
          displayPaymentMode += ` (Paid: ₹${
            patient.PartialPayment.credit
          }, Remaining: ₹${patient.PartialPayment.remainingAmount || 0})`;
        }
      }
    } else {
      // Fallback: Try to parse if it's a JSON string (from database)
      try {
        const parsedPaymentMethod =
          typeof patient.payment_method === "string"
            ? JSON.parse(patient.payment_method)
            : patient.payment_method;

        if (parsedPaymentMethod && parsedPaymentMethod.paymentmethod) {
          displayPaymentMode = parsedPaymentMethod.paymentmethod;

          // Add details based on payment method
          if (parsedPaymentMethod.paymentmethod === "PartialPayment") {
            try {
              const partialDetails = JSON.parse(patient.PartialPayment || "{}");
              if (partialDetails.method) {
                displayPaymentMode = `Partial Payment - ${partialDetails.method}`;
                if (partialDetails.credit) {
                  displayPaymentMode += ` (Paid: ₹${
                    partialDetails.credit
                  }, Remaining: ₹${partialDetails.remainingAmount || 0})`;
                }
              }
            } catch {
              displayPaymentMode = "Partial Payment";
            }
          } else if (parsedPaymentMethod.paymentmethod !== "Cash") {
            // Add details for other payment methods
            const detailKey = `${parsedPaymentMethod.paymentmethod.toLowerCase()}details`;
            if (parsedPaymentMethod[detailKey]) {
              displayPaymentMode += ` (${parsedPaymentMethod[detailKey]})`;
            }
          }
        }
      } catch (err) {
        console.error("Error parsing payment method:", err);
        displayPaymentMode = "NIL";
      }
    }

    const amountInWords = patient.totalAmount
      ? numberToWords(patient.totalAmount) + " rupees only"
      : "";

    const formatDateTimeUTC = (isoString) => {
      if (!isoString) return "NIL";

      const dateObj = new Date(isoString);
      const formatted = dateObj.toLocaleString("en-IN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      });
      // Convert am/pm to AM/PM
      return formatted.replace(/am|pm/gi, (match) => match.toUpperCase());
    };

    // Dynamically populate the receipt with patient values
    const printableContent = `
      <html>
       <head>
      <title>Shanmuga Diagnostics</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #000;
          font-size: 12px;
        }
        .container {
          width: 90%;
          margin: 10px auto;
          padding: 5px;
          border: 1px solid #000;
          font-size: 12px;
        }
        .header {
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
          margin-bottom: 5px;
        }
        .header h1 {
          margin: 0;
          font-size: 14px;
        }
        .header p {
          margin: 2px 0;
          font-size: 10px;
        }
        .header div {
          font-size: 10px;
        }
        .header img {
          width: 100%;
          max-width: 100%;
          height: auto;
        }
        .details,
        .test-info,
        .payment-info {
          width: 100%;
          margin-bottom: 10px;
        }
        .details td,
        .test-info td,
        .payment-info td {
          padding: 2px;
          border-bottom: 1px solid #ddd;
          font-size: 12px;
        }
        .details th,
        .test-info th,
        .payment-info th {
          text-align: left;
          font-size: 12px;
        }
        .details table,
        .test-info table,
        .payment-info table {
          width: 100%;
          border-collapse: collapse;
        }
       
        .payment-info th:first-child,
        .payment-info td:first-child {
          text-align: left;
          padding-left: 8px;
        }
        .signature {
          text-align: right;
          font-size: 12px;
        }
      </style>
    </head>
        <body>
          <div class="container">
            <div class="header">
              <div>CIN : U85110TZ2020PTC033974</div>
              <img src="${headerImage}" alt="Shanmuga Diagnostics" />
              <h1>BILL CUM RECEIPT</h1>
              <p>Contact No: 0427-2706666 / 6369131631</p>
            </div>
            <div class="details">
              <table id="invoiceTable">
                <tr>
                  <td><strong>Bill Date:</strong> ${
                    formatDateTimeUTC(patient.date) || "NIL"
                  }</td>
                  <td><strong>Bill No / Lab ID:</strong> ${
                    patient.lab_id || "NIL"
                  }</td>
                </tr>
                <tr>
                  <td><strong>Patient ID:</strong> ${
                    patient.patient_id || "NIL"
                  }</td>
                  <td><strong>Lab Name:</strong> ${patient.B2B || "NIL"}</td>
                </tr>
                <tr>
                  <td><strong>Name:</strong> ${
                    patient.patientname || "NIL"
                  }</td>
                  <td><strong>Gender/Age:</strong> ${patient.gender || "NIL"}/${
      patient.age || "NIL"
    } Yrs</td>
                </tr>
                <tr>
                  <td><strong>Mobile:</strong> ${patient.phone || "NIL"}</td>
                  <td><strong>Ref By:</strong> ${patient.refby || "SELF"}</td>
                </tr>
              </table>
              <script>
                // Get the table by its ID
                const table = document.getElementById('invoiceTable');
                // Loop through all the <td> elements
                Array.from(table.querySelectorAll('td')).forEach(td => {
                  // If the text includes 'NIL', hide the <td>
                  if (td.textContent.includes('NIL')) {
                    td.style.display = 'none';
                  }
                });
              </script>
            </div>
            <div class="test-info">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                   <th style="text-align:center";>Test Name</th>
                <th style="text-align:right";>Amount(₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
            <div class="payment-info">
            <table>
                <thead>

                </thead>
                <tbody>
                <tr>
                    <td>Total Amount</td>
                    <td style="text-align:right">₹${patient.totalAmount || "NIL"}</td>
                </tr>
                ${
                    patient.discount && parseFloat(patient.discount) > 0
                    ? `<tr>
                        <td>Discount</td>
                        <td style="text-align:right"> ₹${parseFloat(patient.discount).toFixed(2)}</td>
                        </tr>`
                    : ""
                }
                <tr>
                    <td>Mode</td>
                    <td style="text-align:right">${displayPaymentMode || "NIL"}</td>
                </tr>
                </tbody>
            </table>
            <p>Amount Paid in Words: ${amountInWords}</p>
              <div class="signature">
                <div class="signature-label">Signature of Employee</div>
                <div class="employee-name">${patient.registeredby}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(printableContent);
    setTimeout(() => {
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <Container>
      <TitleContainer>Print Patient Bill</TitleContainer>
      <br />
      <Header>
        <HeaderContent>
          <DateFilterContainer>
            <div>
              <label>Start Date: </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <label>End Date: </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </DateFilterContainer>

          <SearchContainer>
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} />
          </SearchContainer>
        </HeaderContent>
      </Header>

      {currentPatients.length === 0 ? (
        <NoResults>No patients found for the selected criteria.</NoResults>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age/Gender</th>
                <th>Segment</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.patient_id}>
                  <td>{format(new Date(patient.date), "dd/MM/yyyy")}</td>
                  <td>{patient.patient_id}</td>
                  <td>{patient.patientname}</td>
                  <td>{`${patient.age}/${patient.gender}`}</td>
                  <td>{patient.segment}</td>
                  <td>₹{patient.totalAmount}</td>
                  <td>
                    <PrintButton onClick={() => handlePrint(patient)}>
                      <Printer size={16} />
                      Print
                    </PrintButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter(
                (num) =>
                  num === 1 ||
                  num === pageCount ||
                  (num >= currentPage - 2 && num <= currentPage + 2)
              )
              .map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={currentPage === number ? "active" : ""}
                >
                  {number}
                </button>
              ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(pageCount)}
              disabled={currentPage === pageCount}
            >
              Last
            </button>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default PrintBill;