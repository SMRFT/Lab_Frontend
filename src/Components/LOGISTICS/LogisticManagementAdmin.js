// Import additional dependencies at the top of your file
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Optional, for styles
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Polyline } from 'react-leaflet';
import { Calendar, User, Clock, Clipboard, ChevronRight, Check, X, FileText, Truck, MessageSquare, Map,Navigation } from 'lucide-react';

// Delete the default icon's reference to the marker images
delete L.Icon.Default.prototype._getIconUrl;

// Set default icon images
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Styled Components with modern design
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #334155;
  background-color: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const Input = styled.input`
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: ${props => props.readOnly ? '#f1f5f9' : '#f8fafc'};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const DatePickerWrapper = styled.div`
  max-width: 250px;
  margin: 0 auto 2rem auto;
  position: relative;
  
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container {
    width: 100%;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  height: 48px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 2.75rem 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const DatePickerIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6366f1;
  pointer-events: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Alert = styled.div`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease-in-out;
  background-color: ${props => props.type === 'success' ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#065f46' : '#b91c1c'};
  border: 1px solid ${props => props.type === 'success' ? '#6ee7b7' : '#fecaca'};
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AlertIcon = styled.div`
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 2.5rem 0 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #6366f1;
    border-radius: 2px;
  }
`;

const TableContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2.5rem;
  background-color: white;
`;

const TableHeader = styled.div`
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Td = styled.td`
  padding: 1.25rem 1.5rem;
  font-size: 0.9375rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${props => {
    if (props.status === 'assigned') return '#e0e7ff';
    if (props.status === 'accepted') return '#dcfce7';
    if (props.status === 'picked') return '#cffafe';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.status === 'assigned') return '#4f46e5';
    if (props.status === 'accepted') return '#16a34a';
    if (props.status === 'picked') return '#0891b2';
    return '#6b7280';
  }};
`;

const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #64748b;
`;

const TimeDisplay = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #6366f1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background-color: #eff6ff;
  width: fit-content;
  margin-bottom: 1.5rem;
`;

// Create a custom icon for the collector
const collectorIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Modal and Map related styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
`;

const MapWrapper = styled.div`
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
`;

const LocationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`;

const ViewLocationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #3b82f6;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #dbeafe;
    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
  }
`;

// Add the LocationModal component
// Enhanced LocationModal with live tracking
const LocationModal = ({ isOpen, onClose, collectorName, collectorData }) => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [routePoints, setRoutePoints] = useState([]);
  const intervalRef = useRef(null);
  const mapRef = useRef(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // Function to get the collector's current location
  const fetchCollectorLocation = async () => {
    try {
      // Format today's date as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // Make API call with both collector name and date parameters
      const response = await axios.get(`${Labbaseurl}sample_collector_location/`, {
        params: { date: today, sampleCollector: collectorName }
      });
      
      if (response.data.success) {
        // Handle the array structure properly
        const locationData = response.data.data && response.data.data.length > 0 
          ? response.data.data[0] 
          : null;
        
        setLocationData(locationData);
        
        // If we have location data, add it to our locations array for tracking
        if (locationData && locationData.latitudeStart && locationData.longitudeStart) {
          const newLocation = {
            lat: parseFloat(locationData.latitudeStart),
            lng: parseFloat(locationData.longitudeStart),
            timestamp: new Date()
          };
          
          setLocations(prevLocations => {
            // Only add if it's different from the last location
            if (prevLocations.length === 0 || 
                (prevLocations[prevLocations.length - 1].lat !== newLocation.lat || 
                 prevLocations[prevLocations.length - 1].lng !== newLocation.lng)) {
              return [...prevLocations, newLocation];
            }
            return prevLocations;
          });
          
          // Update the route if we have multiple points
          if (locations.length > 1) {
            setRoutePoints(locations.map(loc => [loc.lat, loc.lng]));
          }
          
          // If we have a map reference, pan to the new location
          if (mapRef.current) {
            mapRef.current.setView([newLocation.lat, newLocation.lng], 15);
          }
        }
      } else {
        setError(response.data.message || 'Failed to fetch location data');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Failed to fetch location data. Please try again later.');
      setLoading(false);
    }
  };

  // When the modal opens or closes
  useEffect(() => {
    if (isOpen) {
      // Initial fetch to get the location data right away
      fetchCollectorLocation();
      
      // Set up polling to continuously update location (every 5 seconds)
      intervalRef.current = setInterval(fetchCollectorLocation, 5000);
    }

    // Clean up when modal closes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen, collectorName]);

  // Custom styled components for the tracking status
  const TrackingStatus = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: #f0fdf4;
    border-radius: 10px;
    border: 1px solid #dcfce7;
    color: #16a34a;
    font-weight: 600;
  `;

  const LocationInfo = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: #f8fafc;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
  `;

  const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const InfoLabel = styled.span`
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  `;

  const InfoValue = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
  `;

  // Function to calculate distance between points (same as before)
  const calculateDistance = (points) => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const [lat1, lng1] = points[i-1];
      const [lat2, lng2] = points[i];
      
      // Haversine formula to calculate distance between two points
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      totalDistance += d;
    }
    
    return totalDistance.toFixed(2);
  };

  // Get estimated time based on route (same as before)
  const getEstimatedTime = (points) => {
    if (points.length < 2) return "N/A";
    
    const distance = calculateDistance(points);
    // Assume average speed of 30 km/h
    const timeInHours = distance / 30;
    const timeInMinutes = timeInHours * 60;
    
    return `${Math.round(timeInMinutes)} mins`;
  };

  const RouteInfo = styled.div`
    background-color: #f8fafc;
    padding: 1rem;
    border-radius: 12px;
    margin-top: 1rem;
    border: 1px solid #e2e8f0;
  `;

  const RouteStat = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  `;

  const StatLabel = styled.span`
    font-size: 0.75rem;
    color: #64748b;
  `;

  const StatValue = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
  `;

  if (!isOpen) return null;

  // Format date function for consistent date display
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  return date.toLocaleString([], {
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>
          <Map size={20} />
          Live Location: {collectorName}
        </ModalTitle>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </ModalHeader>

      <TrackingStatus>
        <Navigation size={16} />
        Live Tracking
      </TrackingStatus>

      {loading && !locationData ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading location data...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>
      ) : locationData && locationData.latitudeStart && locationData.longitudeStart ? (
        <>
          <LocationInfo>
            <InfoItem>
              <InfoLabel>Current Status</InfoLabel>
              <InfoValue style={{ 
                color: '#16a34a', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem' 
              }}>
                <Navigation size={14} />
                Active - Live Tracking
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Start Time</InfoLabel>
              <InfoValue>
                {locationData.startTime ? formatDateTime(locationData.startTime) : "N/A"}
              </InfoValue>
            </InfoItem>
            {routePoints.length > 0 && (
              <InfoItem>
                <InfoLabel>Distance Travelled</InfoLabel>
                <InfoValue>{calculateDistance(routePoints)} km</InfoValue>
              </InfoItem>
            )}
          </LocationInfo>

          <MapWrapper>
            {locationData && (
              <MapContainer 
                center={[parseFloat(locationData.latitudeStart), parseFloat(locationData.longitudeStart)]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                whenCreated={mapInstance => {
                  mapRef.current = mapInstance;
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Start marker */}
                {locations.length > 0 && (
                  <Marker 
                    position={[locations[0].lat, locations[0].lng]}
                    icon={new L.Icon({
                      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    })}
                  >
                    <Popup>
                      Start Point<br />
                      {formatDateTime(locationData.startTime)}
                    </Popup>
                  </Marker>
                )}
                
                {/* Current location marker */}
                {locations.length > 0 && (
                  <Marker 
                    position={[
                      locations[locations.length - 1].lat, 
                      locations[locations.length - 1].lng
                    ]}
                    icon={new L.Icon({
                      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })}
                  >
                    <Popup>
                      {collectorName} - Current Location<br />
                      Last updated: {locations[locations.length - 1].timestamp.toLocaleTimeString()}
                    </Popup>
                  </Marker>
                )}
                
                {/* Draw polyline for the route */}
                {routePoints.length > 1 && (
                  <Polyline 
                    positions={routePoints}
                    color="#3b82f6"
                    weight={4}
                    opacity={0.7}
                  />
                )}
              </MapContainer>
            )}
          </MapWrapper>
          
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Location is automatically updated every 5 seconds
          </div>
          
          {routePoints.length > 1 && (
            <RouteInfo>
              <RouteStat>
                <StatLabel>Total Distance</StatLabel>
                <StatValue>{calculateDistance(routePoints)} km</StatValue>
              </RouteStat>
              <RouteStat>
                <StatLabel>Estimated Time</StatLabel>
                <StatValue>{getEstimatedTime(routePoints)}</StatValue>
              </RouteStat>
              <RouteStat>
                <StatLabel>Start Time</StatLabel>
                <StatValue>{formatDateTime(locationData.startTime)}</StatValue>
              </RouteStat>
              <RouteStat>
                <StatLabel>Waypoints</StatLabel>
                <StatValue>{routePoints.length}</StatValue>
              </RouteStat>
            </RouteInfo>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          No location data available. The system will automatically begin tracking when data becomes available.
        </div>
      )}
    </ModalContent>
    </ModalOverlay>
  );
};
// Main Component
const LogisticManagementAdmin = () => {
  const [clinicalNames, setClinicalNames] = useState([]);
  const [selectedLabName, setSelectedLabName] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [sampleCollectorOptions, setSampleCollectorOptions] = useState([]);
  const [selectedSampleCollector, setSelectedSampleCollector] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [logisticData, setLogisticData] = useState([]);
  const [getlogisticData, setGetLogisticData] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
  const [selectedTask, setSelectedTask] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedCollectorData, setSelectedCollectorData] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const handleViewLocation = (collectorName, data) => {
    setSelectedCollector(collectorName);
    setSelectedCollectorData(data);
    setShowLocationModal(true);
  };


  // Update the time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    // Initial time set
    updateTime();
    // Update time every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Fetch clinical names on component mount
  useEffect(() => {
    axios
      .get(`${Labbaseurl}get_clinicalname/`)
      .then((response) => {
        setClinicalNames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching clinical names:', error);
      });
  }, []);

  // Fetch Sample Collector Data
  useEffect(() => {
    const fetchSampleCollector = async () => {
      try {
        const response = await axios.get(`${Labbaseurl}sample-collector/`);
        setSampleCollectorOptions(response.data);
      } catch (error) {
        console.error('Error fetching sample collectors:', error);
      }
    };
    fetchSampleCollector();
  }, []);

  // Fetch the saved logistic data for table display
  const fetchLogisticData = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}savesamplecollector/`);
      setLogisticData(response.data);
    } catch (error) {
      console.error('Error fetching logistic data:', error);
    }
  };

  const getfetchLogistic = async () => {
    try {
      const response = await axios.get(`${Labbaseurl}get_logistic_data/`);
      setGetLogisticData(response.data);
    } catch (error) {
      console.error('Error fetching logistic data:', error);
    }
  };

  useEffect(() => {
    fetchLogisticData();
    getfetchLogistic();
  }, []);

  // Handle lab name selection
  const handleLabNameChange = (e) => {
    const selectedName = e.target.value;
    setSelectedLabName(selectedName);
    const selectedLab = clinicalNames.find((lab) => lab.clinicalname === selectedName);
    if (selectedLab) {
      setSalesperson(selectedLab.salesMapping || '');
    } else {
      setSalesperson('');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle Save button click
  const handleSave = () => {
    if (!selectedLabName || !selectedSampleCollector || !selectedTask) {
      setMessage('Please fill in all required fields.');
      setMessageType('danger');
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const payload = {
      labName: selectedLabName,
      salesMapping:salesperson,
      sampleCollector: selectedSampleCollector,
      date: formattedDate,
      sampleordertime: time,
      task: selectedTask
    };

    axios
      .post(`${Labbaseurl}save-logistic-data/`, payload)
      .then(() => {
        setMessage('Task assigned successfully!');
        setMessageType('success');
        setSelectedLabName('');
        setSalesperson('');
        setSelectedSampleCollector('');
        setSelectedTask('');
        fetchLogisticData();
        getfetchLogistic();
        setTimeout(() => {
          setMessage('');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        setMessage('Failed to assign task. Please try again.');
        setMessageType('danger');
        setTimeout(() => {
          setMessage('');
        }, 5000);
      });
  };

  // Filter logistic data to only show today's tasks
  const filterTodayData = () => {
    const today = new Date().toISOString().split('T')[0];
    return logisticData.filter((data) => data.date === today);
  };
  
  // Render status badge with icon
  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    
    return (
      <StatusBadge status={statusLower}>
        {statusLower === 'assigned' && <Clipboard size={14} />}
        {statusLower === 'accepted' && <Check size={14} />}
        {statusLower === 'picked' && <Truck size={14} />}
        {status}
      </StatusBadge>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Logistic Management Admin</Title>
        <Subtitle>Assign and track sample collections across different labs</Subtitle>
      </PageHeader>
      
      <TimeDisplay>
        <Clock size={18} />
        {time}
      </TimeDisplay>
      
      {message && (
        <Alert type={messageType}>
          <AlertIcon>
            {messageType === 'success' ? <Check size={20} /> : <X size={20} />}
          </AlertIcon>
          {message}
        </Alert>
      )}
      
      <Card>
        <Label style={{ textAlign: 'center', display: 'block', marginBottom: '1rem' }}>
          <Calendar size={18} />
          Select Assignment Date
        </Label>
        
        <DatePickerWrapper>
          <StyledDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
          />
          <DatePickerIcon>
            <Calendar size={18} />
          </DatePickerIcon>
        </DatePickerWrapper>
        
        <FormGrid>
          <FormGroup>
            <Label>
              <FileText size={16} />
              Lab Name
            </Label>
            <Select
              value={selectedLabName}
              onChange={handleLabNameChange}
            >
              <option value="">Select Lab Name</option>
              {clinicalNames.map((lab) => (
                <option key={lab.clinicalname} value={lab.clinicalname}>
                  {lab.clinicalname}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <User size={16} />
              Salesperson
            </Label>
            <Input
              type="text"
              placeholder="Salesperson"
              value={salesperson}
              readOnly
            />
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Truck size={16} />
              Sample Collector
            </Label>
            <Select
              value={selectedSampleCollector}
              onChange={(e) => setSelectedSampleCollector(e.target.value)}
            >
              <option value="">Select Sample Collector</option>
              {sampleCollectorOptions.map((collector) => (
                <option key={collector.id} value={collector.name}>
                  {collector.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Clipboard size={16} />
              Task
            </Label>
            <Select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select Task</option>
              <option value="assigned">Assigned</option>
            </Select>
          </FormGroup>
        </FormGrid>
        
        <ButtonContainer>
          <Button onClick={handleSave}>
            Assign Task
            <ChevronRight size={18} />
          </Button>
        </ButtonContainer>
      </Card>
      
      <SectionTitle>Today's Task Assignments</SectionTitle>
      <TableContainer>
        <TableHeader>
          <Clipboard size={20} color="#6366f1" />
          <TableTitle>Today's Assigned Collection Tasks</TableTitle>
        </TableHeader>
        {getlogisticData.filter((data) => data.date === new Date().toISOString().split('T')[0]).length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Lab Name</Th>
                <Th>Salesperson</Th>
                <Th>Sample Collector</Th>
                <Th>Order Time</Th>
                <Th>Track</Th>
              </tr>
            </thead>
            <tbody>
              {getlogisticData
                .filter((data) => data.date === new Date().toISOString().split('T')[0])
                .map((data, index) => (
                  <Tr key={index}>
                    <Td>{formatDate(data.date)}</Td>
                    <Td>{data.labName}</Td>
                    <Td>{data.salesMapping}</Td>
                    <Td>{data.sampleCollector}</Td>
                    <Td>{data.sampleordertime}</Td>
                    <Td>
                      <ViewLocationButton 
                        onClick={() => handleViewLocation(data.sampleCollector, data)}
                      >
                        <Map size={14} />
                        View Live Location
                      </ViewLocationButton>
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No tasks assigned for today. Use the form above to assign new collection tasks.
          </EmptyState>
        )}
      </TableContainer>

      <LocationModal 
        isOpen={showLocationModal} 
        onClose={() => setShowLocationModal(false)} 
        collectorName={selectedCollector}
        collectorData={selectedCollectorData}
      />
      
      <SectionTitle>All Logistic Data</SectionTitle>
      <TableContainer>
        <TableHeader>
          <FileText size={20} color="#6366f1" />
          <TableTitle>Complete Logistics History</TableTitle>
        </TableHeader>
        {filterTodayData().length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Lab Name</Th>
                <Th>Salesperson</Th>
                <Th>Sample Collector</Th>
                <Th>Order Time</Th>
                <Th>Status</Th>
                <Th>Accepted Time</Th>
                <Th>Picked Up Time</Th>
                <Th>Remarks</Th>
              </tr>
            </thead>
            <tbody>
              {filterTodayData().map((data, index) => (
                <Tr key={index}>
                  <Td>{formatDate(data.date)}</Td>
                  <Td>{data.lab_name}</Td>
                  <Td>{data.salesMapping}</Td>
                  <Td>{data.sampleCollector}</Td>
                  <Td>{data.sampleordertime}</Td>
                  <Td>{renderStatusBadge(data.task)}</Td>
                  <Td>{data.sampleacceptedtime || '—'}</Td>
                  <Td>{data.samplepickeduptime || '—'}</Td>
                  <Td>
                    {data.remarks ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MessageSquare size={14} />
                        {data.remarks}
                      </div>
                    ) : '—'}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No logistics data available for today. Task history will appear here once tasks are assigned.
          </EmptyState>
        )}
      </TableContainer>
    </PageContainer>
  );
};

export default LogisticManagementAdmin;