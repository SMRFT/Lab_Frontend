import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled, { css, createGlobalStyle } from "styled-components";
import { AlertCircle, CheckCircle, Save, Truck, Calendar, Clock, User, FileText, MessageSquare } from "lucide-react";
import axios from "axios";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TrackerContainer = styled.div`
  margin: 0 auto;
  padding: 0 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const TrackerButton = styled.button`
  padding: 10px 16px;
  background-color: ${props => props.color || '#4CAF50'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.hoverColor || '#45a049'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// Global styles for consistent look
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f7f9fc;
    color: #333;
    margin: 0;
    padding: 0;
  }
`;

// Main Container with responsive padding
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

// Modern Header Section with gradient
export const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 0.5rem;
  margin-bottom: 0;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

// Alert Box with animation
export const AlertWrapper = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
  transition: opacity 0.3s ease;
  
  @keyframes slideDown {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  ${(props) =>
    props.variant === "success" &&
    css`
      background-color: #ecfdf5;
      color: #065f46;
      border-left: 4px solid #10b981;
    `}
  
  ${(props) =>
    props.variant === "danger" &&
    css`
      background-color: #fef2f2;
      color: #991b1b;
      border-left: 4px solid #ef4444;
    `}
`;

// Filter Bar
export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex: 1;
  }
`;

export const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

// Table Container with scrollable shadow
export const TableContainer = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 767px) {
    display: none;
  }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 0.375rem;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 0.375rem;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  
  &:nth-child(even) {
    background-color: #fcfcfd;
  }
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: #e5e7eb;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
`;

// Form Elements with consistent styling
export const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
  padding-right: 2rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  font-size: 0.875rem;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  position: relative;
`;

export const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const CheckboxCustom = styled.div`
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 0.25rem;
  border: 1.5px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  background-color: ${(props) => (props.checked ? '#6366f1' : 'transparent')};
  border-color: ${(props) => (props.checked ? '#6366f1' : '#d1d5db')};
  
  &:after {
    content: '';
    display: ${(props) => (props.checked ? 'block' : 'none')};
    width: 0.375rem;
    height: 0.625rem;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 1px;
  }
`;

export const CheckboxLabel = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

// Buttons with hover effects
export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: ${(props) => props.variant === 'secondary' ? '#f3f4f6' : '#6366f1'};
  color: ${(props) => props.variant === 'secondary' ? '#4b5563' : 'white'};
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props) => props.variant === 'secondary' ? '#e5e7eb' : '#4f46e5'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
`;

// Mobile Card View with modern styling
export const CardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:active {
    transform: scale(0.99);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const CardBody = styled.div`
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
`;

export const CardField = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
`;

export const FieldLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const FieldValue = styled.div`
  color: #1f2937;
  font-size: 0.875rem;
`;

export const CardFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  
  ${(props) =>
    props.variant === "success" &&
    css`
      background-color: #ecfdf5;
      color: #065f46;
    `}
  
  ${(props) =>
    props.variant === "pending" &&
    css`
      background-color: #fffbeb;
      color: #92400e;
    `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const EmptyStateIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const LogisticManagementApproval = () => {
  const location = useLocation();
  const userName = location.state?.userName || localStorage.getItem("name");
  const [todayTasks, setTodayTasks] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [loading, setLoading] = useState(true);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // Tracking state
  const [isTracking, setIsTracking] = useState(() => {
    // Check if tracking was active when page was last loaded
    return localStorage.getItem("trackingActive") === "true";
  });
  const [error, setError] = useState(null);
  const [startPosition, setStartPosition] = useState(() => {
    const savedStartPos = localStorage.getItem("startPosition");
    return savedStartPos ? JSON.parse(savedStartPos) : null;
  });
  const [currentPosition, setCurrentPosition] = useState(() => {
    const savedCurrentPos = localStorage.getItem("currentPosition");
    return savedCurrentPos ? JSON.parse(savedCurrentPos) : null;
  });
  const [endPosition, setEndPosition] = useState(null);
  const [travelInfo, setTravelInfo] = useState(() => {
    return localStorage.getItem("travelInfo") || "";
  });
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (userName) {
      setLoading(true);
      axios
        .get(`${Labbaseurl}getlogisticdata/?sampleCollector=${userName}`)
        .then((response) => {
          const currentDate = new Date().toISOString().split("T")[0];
          setTodayTasks(response.data.filter((task) => task.date === currentDate));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching logistic data:", error);
          setLoading(false);
        });
    }
  }, [userName]);

// Initialize tracking if it was active before refresh
useEffect(() => {
  // Load user name from localStorage or other source to ensure consistency
  const storedUserName = localStorage.getItem("userName") || userName;
  
  if (isTracking && startPosition) {
    // Restart position watching
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Store as raw numbers
        const newPosition = { lat: latitude, lng: longitude };
        setCurrentPosition(newPosition);
        localStorage.setItem("currentPosition", JSON.stringify(newPosition));
      },
      (error) => {
        setError(`Error tracking location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  // Clean up on unmount
  return () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };
}, [isTracking, startPosition]);

// Function to save start location data to backend (POST)
const saveStartLocation = (position) => {
  const currentDate = new Date().toISOString().split("T")[0];
  
  // Ensure userName is stored and consistent
  const collectorName = userName;
  localStorage.setItem("userName", collectorName);
  
  const payload = {
    sampleCollector: collectorName,
    date: currentDate,
    latitudeStart: position.lat,
    longitudeStart: position.lng
  };
  
  // console.log("Sending start location for collector:", collectorName);
  // console.log("Payload:", payload);
  
  axios.post(`${Labbaseurl}sample_collector_location/`, payload)
    .then(response => {
      if (response.data.success) {
        console.log("Start location saved successfully:", response.data);
      } else {
        setError(`Failed to save start location data: ${response.data.message}`);
      }
    })
    .catch(error => {
      console.error("Error saving start location:", error);
      setError("Failed to save start location data. Please try again.");
    });
};

// Function to update end location data (PUT)
const updateEndLocation = (position) => {
  const currentDate = new Date().toISOString().split("T")[0];
  
  // Ensure userName is consistent with what was used for start location
  const collectorName = localStorage.getItem("userName") || userName;
  
  const payload = {
    sampleCollector: collectorName,
    date: currentDate,
    latitudeEnd: position.lat,
    longitudeEnd: position.lng
  };
  
  // console.log("Sending end location for collector:", collectorName);
  // console.log("Payload:", payload);
  
  axios.put(`${Labbaseurl}sample_collector_location/`, payload)
    .then(response => {
      if (response.data.success) {
        console.log("End location updated successfully:", response.data);
        
        // Update UI with distance from the response
        if (response.data.distance_travelled) {
          const distance = parseFloat(response.data.distance_travelled);
          const distanceText = distance > 1000 
            ? `${(distance / 1000).toFixed(2)} km` 
            : `${distance} meters`;
            
          // Display distance in UI
          setTravelInfo(`Distance traveled: ${distanceText}`);
          localStorage.setItem("travelInfo", `Distance traveled: ${distanceText}`);
        }
      } else {
        setError(`Failed to update end location data: ${response.data.message}`);
      }
    })
    .catch(error => {
      console.error("Error updating end location:", error);
      if (error.response) {
        setError(`Server error: ${error.response.data.message || "Unknown error"}`);
      } else {
        setError("Failed to update end location data. Please try again.");
      }
    });
};

const startTracking = () => {
  setError(null);
  setTravelInfo("");
  
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser");
    return;
  }
  
  // Ensure userName is stored
  localStorage.setItem("userName", userName);
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Store as raw numbers
      const currentPos = { 
        lat: latitude, 
        lng: longitude 
      };
      
      // Save to state and localStorage
      setStartPosition(currentPos);
      setCurrentPosition(currentPos);
      setIsTracking(true);
      
      localStorage.setItem("startPosition", JSON.stringify(currentPos));
      localStorage.setItem("currentPosition", JSON.stringify(currentPos));
      localStorage.setItem("trackingActive", "true");
      localStorage.setItem("trackingDate", new Date().toISOString().split("T")[0]);
      
      // Save start location to backend using POST
      saveStartLocation(currentPos);
      
      // Start watching position
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { 
            lat: latitude, 
            lng: longitude 
          };
          setCurrentPosition(newPosition);
          localStorage.setItem("currentPosition", JSON.stringify(newPosition));
        },
        (error) => {
          setError(`Error tracking location: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    },
    (error) => {
      setError(`Error getting location: ${error.message}`);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};

const stopTracking = () => {
  if (currentPosition) {
    // Ensure coordinates are properly processed
    const positionToSend = {
      lat: currentPosition.lat,
      lng: currentPosition.lng
    };
    
    setEndPosition(positionToSend);
    
    // Update end location using PUT
    updateEndLocation(positionToSend);
  }
  
  // Update state and localStorage
  setIsTracking(false);
  localStorage.setItem("trackingActive", "false");
  
  // Don't remove userName to maintain consistency between sessions
  
  // Clear the watch
  if (watchIdRef.current) {
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }
};


  // Handle other task-related functions
  const handleCheckboxChange = (index, checked) => {
    setTodayTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index
          ? {
              ...task,
              samplePickedUp: checked,
              samplePickedUpTime: checked
                ? new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "",
            }
          : task
      )
    );
  };

  const handleTaskChange = (index, taskValue) => {
    setTodayTasks((prevTasks) =>
      prevTasks.map((task, i) => (i === index ? { ...task, task: taskValue } : task))
    );
  };

  const handleRemarksChange = (index, remarks) => {
    setTodayTasks((prevTasks) =>
      prevTasks.map((task, i) => (i === index ? { ...task, remarks } : task))
    );
  };

  const saveTask = (index) => {
    // Task saving logic (unchanged)
    const taskToUpdate = todayTasks[index];
    if (!taskToUpdate) {
      console.error("Invalid task index");
      return;
    }

    const payload = {
      sampleCollector: userName,
      date: taskToUpdate.date,
      sampleordertime: taskToUpdate.sampleordertime,
      lab_name: taskToUpdate.labName,
      salesMapping: taskToUpdate.salesMapping,
    };

    // Show loading alert
    setAlert({ message: "Saving task...", type: "pending", visible: true });

    axios
      .get(`${Labbaseurl}savesamplecollector/`, {
        params: payload,
      })
      .then((response) => {
        const existingTasks = response.data;
        const matchedTask = existingTasks.find(
          (task) =>
            task.date === taskToUpdate.date &&
            task.time === taskToUpdate.time &&
            task.lab_name === taskToUpdate.labName
        );

        if (matchedTask) {
          // If a matching task exists, update (PATCH)
          const updatePayload = {
            ...payload,
            samplePickedUp: taskToUpdate.samplePickedUp,
            samplePickedUpTime: taskToUpdate.samplePickedUpTime,
            remarks: taskToUpdate.remarks || "",
            salesperson: taskToUpdate.salesperson,
          };

          axios
            .patch(`${Labbaseurl}updatesamplecollectordetails/`, updatePayload)
            .then(() => {
              setAlert({ message: "Task updated successfully", type: "success", visible: true });
              setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
            })
            .catch((error) => {
              console.error("Error updating task:", error);
              setAlert({ message: "Error updating task", type: "danger", visible: true });
              setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
            });
        } else {
          // If no matching task, create a new one (POST)
          const savePayload = {
            ...payload,
            task: taskToUpdate.task || "Accepted",
            samplePickedUp: taskToUpdate.samplePickedUp,
            samplePickedUpTime: taskToUpdate.samplePickedUpTime,
            remarks: taskToUpdate.remarks || "",
            sampleacceptedtime: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
          };

          axios
            .post(`${Labbaseurl}savesamplecollector/`, savePayload)
            .then(() => {
              setAlert({ message: "Task saved successfully", type: "success", visible: true });
              setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
              setTodayTasks((prevTasks) =>
                prevTasks.map((task, i) => (i === index ? { ...task, saved: true } : task))
              );
            })
            .catch((error) => {
              console.error("Error saving task:", error);
              setAlert({ message: "Error saving task", type: "danger", visible: true });
              setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking existing task:", error);
        setAlert({ message: "Error checking task existence", type: "danger", visible: true });
        setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
      });
  };

  return (
    <>
      <GlobalStyle />
      <TrackerContainer>
      
        <ButtonContainer>
          {!isTracking ? (
            <TrackerButton 
              onClick={startTracking}
              color="#2196F3"
              hoverColor="#0b7dda"
            >
              Start
            </TrackerButton>
          ) : (
            <TrackerButton 
              onClick={stopTracking}
              color="#f44336"
              hoverColor="#d32f2f"
            >
              Stop
            </TrackerButton>
          )}
        </ButtonContainer>
      
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
    
        {travelInfo && (
          <div className="travel-info">
            <h4>Travel Information:</h4>
            <div className="distance-info">{travelInfo}</div>
          </div>
        )}
      </TrackerContainer>
      <Container>
        <Header>
          <Title>Logistic Management Approval</Title>
          <Subtitle>Manage sample collection status and updates</Subtitle>
        </Header>

        {alert.visible && (
          <AlertWrapper variant={alert.type}>
            {alert.type === "success" ? (
              <CheckCircle size={20} />
            ) : alert.type === "danger" ? (
              <AlertCircle size={20} />
            ) : (
              <Clock size={20} />
            )}
            {alert.message}
          </AlertWrapper>
        )}

        {loading ? (
          <EmptyState>
            <EmptyStateIcon>
              <Clock size={24} />
            </EmptyStateIcon>
            <p>Loading tasks...</p>
          </EmptyState>
        ) : todayTasks.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <Truck size={24} />
            </EmptyStateIcon>
            <p>No tasks scheduled for today</p>
            <Button variant="secondary">Refresh</Button>
          </EmptyState>
        ) : (
          <>
            <TableContainer>
              <TableScroll>
                <StyledTable>
                  <TableHead>
                    <tr>
                      <TableHeader>Date</TableHeader>
                      <TableHeader>Order Time</TableHeader>
                      <TableHeader>Lab Name</TableHeader>
                      <TableHeader>Salesperson</TableHeader>
                      <TableHeader>Task</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Pickup Time</TableHeader>
                      <TableHeader>Remarks</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </tr>
                  </TableHead>
                  <tbody>
                    {todayTasks.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell>{task.date}</TableCell>
                        <TableCell>{task.sampleordertime}</TableCell>
                        <TableCell>{task.labName}</TableCell>
                        <TableCell>{task.salesMapping}</TableCell>
                        <TableCell>
                          <Select
                            value={task.task || "Accepted"}
                            onChange={(e) => handleTaskChange(index, e.target.value)}
                          >
                            <option value="Accepted">Accepted</option>
                            <option value="Not Accepted">Not Accepted</option>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <CheckboxContainer>
                            <CheckboxInput
                              type="checkbox"
                              checked={task.samplePickedUp || false}
                              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                            />
                            <CheckboxCustom checked={task.samplePickedUp || false} />
                            <CheckboxLabel>
                              {task.samplePickedUp ? "Picked Up" : "Sample Pickup"}
                            </CheckboxLabel>
                          </CheckboxContainer>
                        </TableCell>
                        <TableCell>
                          {task.samplePickedUpTime ? (
                            <Badge variant="success">{task.samplePickedUpTime}</Badge>
                          ) : (
                            <Badge variant="pending">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Enter remarks"
                            value={task.remarks || ""}
                            onChange={(e) => handleRemarksChange(index, e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => saveTask(index)}>
                            <Save size={16} />
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </StyledTable>
              </TableScroll>
            </TableContainer>

            {/* Mobile Card View */}
            <CardContainer>
              {todayTasks.map((task, index) => (
                <Card key={index}>
                  <CardHeader>
                    <span>{task.labName}</span>
                    <Badge variant={task.samplePickedUp ? "success" : "pending"}>
                      {task.samplePickedUp ? "Picked Up" : "Pending"}
                    </Badge>
                  </CardHeader>
                  <CardBody>
                    <CardField>
                      <FieldLabel>
                        <Calendar size={14} /> Date:
                      </FieldLabel>
                      <FieldValue>{task.date}</FieldValue>
                    </CardField>
                    <CardField>
                      <FieldLabel>
                        <Clock size={14} /> Order Time:
                      </FieldLabel>
                      <FieldValue>{task.sampleordertime}</FieldValue>
                    </CardField>
                    <CardField>
                      <FieldLabel>
                        <User size={14} /> Salesperson:
                      </FieldLabel>
                      <FieldValue>{task.salesperson}</FieldValue>
                    </CardField>
                    <CardField>
                      <FieldLabel>
                        <FileText size={14} /> Task:
                      </FieldLabel>
                      <FieldValue>
                        <Select
                          value={task.task || "Accepted"}
                          onChange={(e) => handleTaskChange(index, e.target.value)}
                        >
                          <option value="Accepted">Accepted</option>
                          <option value="Not Accepted">Not Accepted</option>
                        </Select>
                      </FieldValue>
                    </CardField>
                    <CardField>
                      <FieldLabel>
                        <Truck size={14} /> Status:
                      </FieldLabel>
                      <FieldValue>
                        <CheckboxContainer>
                          <CheckboxInput
                            type="checkbox"
                            checked={task.samplePickedUp || false}
                            onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                          />
                          <CheckboxCustom checked={task.samplePickedUp || false} />
                          <CheckboxLabel>
                            {task.samplePickedUp ? "Picked Up" : "Sample Pickup"}
                          </CheckboxLabel>
                        </CheckboxContainer>
                      </FieldValue>
                    </CardField>
                    {task.samplePickedUp && (
                      <CardField>
                        <FieldLabel>
                          <Clock size={14} /> Pickup Time:
                        </FieldLabel>
                        <FieldValue>{task.samplePickedUpTime}</FieldValue>
                      </CardField>
                    )}
                    <CardField>
                      <FieldLabel>
                        <MessageSquare size={14} /> Remarks:
                      </FieldLabel>
                      <FieldValue>
                        <Input
                          type="text"
                          placeholder="Enter remarks"
                          value={task.remarks || ""}
                          onChange={(e) => handleRemarksChange(index, e.target.value)}
                        />
                      </FieldValue>
                    </CardField>
                  </CardBody>
                  <CardFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button onClick={() => saveTask(index)}>
                      <Save size={16} />
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContainer>
          </>
        )}
      </Container>
    </>
  );
};

export default LogisticManagementApproval;