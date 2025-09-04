import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import "./App.css";

import Register from "./Components/AUTH/Register";
import Login from "./Components/AUTH/Login";
import Sidebar from "./Components/Navbar/Sidebar";
import TestDetailsForm from "./Components/TEST/TestDetails";
import PatientForm from "./Components/PATIENT/PatientForm";
import SampleCollectorForm from "./Components/FORMS/SampleCollectorForm";
import PatientDetails from "./Components/TEST/PatientDetails";
import DoctorForm from "./Components/TESTAPPROVAL/DoctorForm";
import Dashboard from "./Components/REPORT/Dashboard";
import PatientList from "./Components/TESTAPPROVAL/PatientList";
import SampleStatusUpdate from "./Components/SAMPLE/SampleStatusUpdate";
import ClinicalName from "./Components/FORMS/ClinicalName";
import PatientOverview from "./Components/REPORT/PatientOverview";
import CashTally from "./Components/FINANCE/CashTally";
import SampleStatus from "./Components/SAMPLE/SampleStatus";
import PrintBill from "./Components/PATIENT/PrintBill";
import TestForm from "./Components/FORMS/TestForm";
import BarcodeGeneration from "./Components/BARCODE/BarcodeGeneration";
import BarcodeTestDetails from "./Components/BARCODE/BarcodeTestDetails";
import RefBy from "./Components/FORMS/RefBy";
import PatientOverallReport from "./Components/FINANCE/PatientOverallReport";
import SalesVisitLog from "./Components/SALES/SalesVisitLog";
import SalesVisitLogReport from "./Components/SALES/SalesVisitLogReport";
import SalesReport from "./Components/SALES/SalesReport";
import TestEdit from "./Components/FORMS/TestEdit";
import LogisticManagementAdmin from "./Components/LOGISTICS/LogisticManagementAdmin";
import LogisticManagementApproval from "./Components/LOGISTICS/LogisticManagementApproval";
import PatientEditForm from "./Components/PATIENT/PatientEditForm";
import MIS from "./Components/MIS/MIS";
import SalesVisitDashboard from "./Components/SALES/SalesVisitDashboard";
import Invoicemain from "./Components/FINANCE/Invoicemain";
import SalesDashboard from "./Components/SALES/SalesDashboard";
import LogisticsDashboard from "./Components/LOGISTICS/LogisticsDashboard";
import LogisticsTAT from "./Components/MIS/LogisticsTAT";
import Refund from "./Components/REFUND/Refund";
import PatientBilling from "./Components/PATIENT/PatientBilling";
import B2B from "./Components/B2B/B2B";
import B2BApproval from "./Components/B2B/B2BApproval";
import B2BFinalApproval from "./Components/B2B/B2BFinalApproval";
import Cancellation from "./Components/REFUND/Cancellation";
import PatientTAT from "./Components/MIS/PatientTAT";
import RefundAndCancellationLog from "./Components/REFUND/RefundAndCancellationLog";
import PaymentDashboard from "./Components/REPORT/PaymentDashboard";
import RegisterDashboard from "./Components/REPORT/RegisterDashboard";
import SalesDetailsEdit from "./Components/SALES/SalesDetailsEdit";
import B2BReport from "./Components/B2B/B2BReport";
import LiveTrackingDashboard from "./Components/LOGISTICS/LogisticsMap";
import B2BPackage from "./Components/B2B/B2BPackage";
import B2BPackageApproval from "./Components/B2B/B2BPackageApproval";
import Estimate from "./Components/PATIENT/Estimate";

// Wrapper for the main content to shift it to the right of the sidebar
const ContentWrapper = styled.div`
  margin-top: 15px;
  padding: 20px;
  margin-left: 260px;

  @media (max-width: 1024px) {
    margin-left: 200px;
  }

  @media (max-width: 768px) {
    margin-left: 100px;
  }

  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

function App() {
  const location = useLocation();
  const [role, setRole] = useState(null); // use state for role

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Paths where the sidebar should be hidden
  const hideSidebarRoutes = ["/"];

  return (
    <div>
      {/* Conditionally render the Sidebar based on the route */}
      {!hideSidebarRoutes.includes(location.pathname) && role && (
        <Sidebar role={role} />
      )}

      {/* Only apply ContentWrapper on non-login routes */}
      {hideSidebarRoutes.includes(location.pathname) ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <ContentWrapper>
          <Routes>
            {/* Define all routes here */}
            <Route path="/PatientForm" element={<PatientForm />} />
            <Route
              path="/SampleCollectorForm"
              element={<SampleCollectorForm />}
            />
            <Route path="/ClinicalName" element={<ClinicalName />} />
            <Route path="/RefBy" element={<RefBy />} />
            <Route path="/TestForm" element={<TestForm />} />
            <Route path="/PrintBill" element={<PrintBill />} />
            <Route path="/SampleStatus" element={<SampleStatus />} />
            <Route path="/BarcodeGeneration" element={<BarcodeGeneration />} />
            <Route
              path="/BarcodeTestDetails"
              element={<BarcodeTestDetails />}
            />
            <Route path="/PatientOverview" element={<PatientOverview />} />
            <Route path="/PatientDetails" element={<PatientDetails />} />
            <Route path="/TestDetails" element={<TestDetailsForm />} />
            <Route
              path="/SampleStatusUpdate"
              element={<SampleStatusUpdate />}
            />
            <Route path="/TestEdit" element={<TestEdit />} />
            <Route path="/PatientList" element={<PatientList />} />
            <Route path="/DoctorForm" element={<DoctorForm />} />
            <Route path="/Registration" element={<Register />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Invoice" element={<Invoicemain />} />
            <Route path="/CashTally" element={<CashTally />} />
            <Route path="/PatientOverview" element={<PatientOverview />} />
            <Route
              path="/PatientOverallReport"
              element={<PatientOverallReport />}
            />
            <Route
              path="/SalesVisitDashboard"
              element={<SalesVisitDashboard />}
            />
            <Route path="/SalesVisitLog" element={<SalesVisitLog />} />
            <Route
              path="/SalesVisitLogReport"
              element={<SalesVisitLogReport />}
            />
            <Route path="/SalesReport" element={<SalesReport />} />
            <Route
              path="/LogisticManagementAdmin"
              element={<LogisticManagementAdmin />}
            />
            <Route
              path="/LogisticManagementApproval"
              element={<LogisticManagementApproval />}
            />
            <Route path="/PatientEditForm" element={<PatientEditForm />} />
            <Route path="/MIS" element={<MIS />} />
            <Route path="/Invoicemain" element={<Invoicemain />} />
            <Route path="/SalesDashboard" element={<SalesDashboard />} />
            <Route
              path="/LogisticsDashboard"
              element={<LogisticsDashboard />}
            />
            <Route path="/LogisticsTAT" element={<LogisticsTAT />} />
            <Route path="/Refund" element={<Refund />} />
            <Route path="/Cancellation" element={<Cancellation />} />
            <Route path="/PatientBilling" element={<PatientBilling />} />
            <Route path="/B2B" element={<B2B />} />
            <Route path="/B2BApproval" element={<B2BApproval />} />
            <Route path="/B2BFinalApproval" element={<B2BFinalApproval />} />
            <Route path="/PatientTAT" element={<PatientTAT />} />
            <Route
              path="/RefundAndCancellationLog"
              element={<RefundAndCancellationLog />}
            />
            <Route path="/PaymentDashboard" element={<PaymentDashboard />} />
            <Route path="/RegisterDashboard" element={<RegisterDashboard />} />
            <Route path="/SalesDetailsEdit" element={<SalesDetailsEdit />} />
            <Route path="/B2BReport" element={<B2BReport />} />
            <Route path="/B2BPackage" element={<B2BPackage />} />
            <Route
              path="/B2BPackageApproval"
              element={<B2BPackageApproval />}
            />
            <Route
              path="/LiveTrackingDashboard"
              element={<LiveTrackingDashboard />}
            />
            <Route path="/Estimate" element={<Estimate />} />
            {/* Add more routes as needed */}
          </Routes>
        </ContentWrapper>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router >
      <App />
    </Router>
  );
}
