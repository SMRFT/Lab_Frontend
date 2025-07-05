import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  Package,
  User,
  DollarSign,
  TestTube,
  Check,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
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

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => {
    if (props.approved) return "var(--success)";
    if (props.primary) return "var(--primary)";
    return "white";
  }};
  color: ${(props) => {
    if (props.approved) return "white";
    if (props.primary) return "white";
    return "var(--gray)";
  }};
  border: 1px solid
    ${(props) => {
      if (props.approved) return "var(--success)";
      if (props.primary) return "var(--primary)";
      return "var(--gray-light)";
    }};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};

  &:hover {
    background-color: ${(props) => {
      if (props.approved) return "var(--success)";
      if (props.primary) return "var(--primary-dark)";
      return "var(--gray-light)";
    }};
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid var(--gray-light);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Toast Component
const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${(props) =>
    props.type === "error" ? "var(--danger)" : "var(--success)"};
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 3.5s forwards;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PackageCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  border-left: 4px solid var(--warning);
  transition: var(--transition);

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PackageHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PackageTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
`;

const PackageBody = styled.div`
  padding: 1rem;
`;

const PackageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const InfoIcon = styled.div`
  color: var(--primary);
  margin-top: 0.125rem;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 0.875rem;
`;

const InfoValue = styled.div`
  color: var(--dark);
  margin-top: 0.25rem;
`;

const TestNamesList = styled.div`
  max-height: 120px;
  overflow-y: auto;
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  margin-top: 0.5rem;
`;

const TestName = styled.div`
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--dark);

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-light);
  }
`;

const PackageFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  background-color: var(--light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DateInfo = styled.div`
  font-size: 0.75rem;
  color: var(--gray);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: var(--gray);
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const B2BPackageApproval = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState({});
  const [toast, setToast] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${Labbaseurl}b2b_packages/`);
      if (response.ok) {
        const data = await response.json();
        // Filter out approved packages - only show pending packages
        const pendingPackages = data.filter((pkg) => pkg.status !== "Approved");
        setPackages(pendingPackages);
      } else {
        showToast("Failed to fetch packages", "error");
      }
    } catch (error) {
      showToast("Error fetching packages: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Labbaseurl) {
      fetchPackages();
    }
  }, [Labbaseurl]);

  // Handle package approval
  const handleApprove = async (clinicalname) => {
    setApproving((prev) => ({ ...prev, [clinicalname]: true }));

    try {
      const response = await fetch(`${Labbaseurl}b2b_packages/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clinicalname: clinicalname }),
      });

      if (response.ok) {
        showToast("Package approved successfully.");
        // Remove the approved package from the local state immediately
        setPackages((prev) =>
          prev.filter((pkg) => pkg.clinicalname !== clinicalname)
        );
      } else {
        const errorData = await response.json();
        showToast(
          `Error: ${errorData.error || "Failed to approve package"}`,
          "error"
        );
      }
    } catch (error) {
      showToast("Network error while approving.", "error");
    } finally {
      setApproving((prev) => ({ ...prev, [clinicalname]: false }));
    }
  };

  // Parse test names from string
  const parseTestNames = (testNamesString) => {
    try {
      if (typeof testNamesString === "string") {
        return JSON.parse(testNamesString);
      }
      return Array.isArray(testNamesString) ? testNamesString : [];
    } catch (error) {
      return [];
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format rate
  const formatRate = (rate) => {
    if (rate && rate.$numberDecimal) {
      return `₹${parseFloat(rate.$numberDecimal).toFixed(2)}`;
    }
    return `₹${rate || "0.00"}`;
  };

  // Get package ID - handle different data structures
  const getPackageId = (pkg) => {
    if (pkg._id && pkg._id.$oid) {
      return pkg._id.$oid;
    }
    if (pkg._id) {
      return pkg._id;
    }
    if (pkg.id) {
      return pkg.id;
    }
    // Fallback to clinical name if no ID available
    return pkg.clinicalname || `pkg-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Get date value - handle different data structures
  const getDateValue = (dateObj) => {
    if (dateObj && dateObj.$date) {
      return dateObj.$date;
    }
    return dateObj;
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <CardHeader>
              <Title>
                <Package size={24} />
                B2B Package Approval
              </Title>
            </CardHeader>
            <CardBody>
              <LoadingContainer>
                <LoadingSpinner />
                Loading packages...
              </LoadingContainer>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        {toast && (
          <Toast type={toast.type}>
            {toast.type === "success" ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </Toast>
        )}

        <Card>
          <CardHeader>
            <Title>
              <Package size={24} />
              B2B Package Approval
            </Title>
          </CardHeader>
          <CardBody>
            {packages.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>✅</EmptyStateIcon>
                <h3>No pending packages</h3>
                <p>
                  All packages have been approved or there are no packages to
                  review at the moment.
                </p>
              </EmptyState>
            ) : (
              <PackageGrid>
                {packages.map((pkg) => {
                  const packageId = getPackageId(pkg);
                  const testNames = parseTestNames(pkg.testNames);

                  return (
                    <PackageCard key={packageId}>
                      <PackageHeader>
                        <div>
                          <PackageTitle>{pkg.packageName}</PackageTitle>
                        </div>
                      </PackageHeader>

                      <PackageBody>
                        <PackageInfo>
                          <InfoItem>
                            <InfoIcon>
                              <User size={16} />
                            </InfoIcon>
                            <InfoContent>
                              <InfoLabel>Clinical Name</InfoLabel>
                              <InfoValue>{pkg.clinicalname}</InfoValue>
                            </InfoContent>
                          </InfoItem>

                          <InfoItem>
                            <InfoIcon>
                              <DollarSign size={16} />
                            </InfoIcon>
                            <InfoContent>
                              <InfoLabel>Rate</InfoLabel>
                              <InfoValue>{formatRate(pkg.rate)}</InfoValue>
                            </InfoContent>
                          </InfoItem>

                          <InfoItem>
                            <InfoIcon>
                              <TestTube size={16} />
                            </InfoIcon>
                            <InfoContent>
                              <InfoLabel>
                                Test Names ({testNames.length})
                              </InfoLabel>
                              <TestNamesList>
                                {testNames.map((testName, index) => (
                                  <TestName key={index}>{testName}</TestName>
                                ))}
                              </TestNamesList>
                            </InfoContent>
                          </InfoItem>
                        </PackageInfo>
                      </PackageBody>

                      <PackageFooter>
                        <DateInfo>
                          Created: {formatDate(getDateValue(pkg.created_date))}
                        </DateInfo>
                        <Button
                          primary
                          disabled={approving[pkg.clinicalname]}
                          onClick={() => handleApprove(pkg.clinicalname)}
                        >
                          {approving[pkg.clinicalname] ? (
                            <LoadingSpinner />
                          ) : (
                            <Check size={16} />
                          )}
                          Approve
                        </Button>
                      </PackageFooter>
                    </PackageCard>
                  );
                })}
              </PackageGrid>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default B2BPackageApproval;
