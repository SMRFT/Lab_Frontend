import { useState, useEffect, useRef } from "react"
import styled, { createGlobalStyle } from "styled-components"
import {
  MapPin,
  Navigation,
  Calendar,
  Users,
  Clock,
  Route,
  Timer,
  Eye,
  Activity,
  Filter,
  RefreshCw,
  MapIcon,
  AlertCircle,
  Loader,
} from "lucide-react"
import axios from "axios"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f7f9fc;
    color: #333;
    margin: 0;
    padding: 0;
  }
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
`

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.color || "#6366f1"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const StatContent = styled.div`
  flex: 1;
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`

const MapSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
`

const MapHeader = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`

const MapTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MapControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Button = styled.button`
  background-color: ${(props) => (props.variant === "secondary" ? "rgba(255, 255, 255, 0.2)" : "#10b981")};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${(props) => (props.variant === "secondary" ? "rgba(255, 255, 255, 0.3)" : "#059669")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const MapContainer = styled.div`
  height: 600px;
  position: relative;
  background: #f1f5f9;
  overflow: hidden;
`

const MapElement = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`

const MapLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const TableSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`

const TableHeader = styled.div`
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`

const TableTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DateFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const DateInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #475569;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  white-space: nowrap;
`

const Tr = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`

const Td = styled.td`
  padding: 1rem 1.5rem;
  color: #334155;
  font-size: 0.875rem;
  vertical-align: middle;
  white-space: nowrap;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(props) =>
    props.status === "active" ? "#dcfce7" : props.status === "completed" ? "#e0e7ff" : "#f3f4f6"};
  color: ${(props) => (props.status === "active" ? "#16a34a" : props.status === "completed" ? "#4f46e5" : "#6b7280")};
`

const ViewButton = styled.button`
  background-color: #eff6ff;
  color: #3b82f6;
  border: none;
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  &:hover {
    background-color: #dbeafe;
    transform: translateY(-1px);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
  font-size: 1rem;
`

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6366f1;
  font-size: 0.875rem;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

// Main Component
const LiveTrackingDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [trackingData, setTrackingData] = useState([])
  const [loading, setLoading] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const [error, setError] = useState(null)
  const [map, setMap] = useState(null)
  const [mapMarkers, setMapMarkers] = useState([])
  const [routePolylines, setRoutePolylines] = useState([])
  const mapRef = useRef(null)
  const [stats, setStats] = useState({
    totalCollectors: 0,
    activeCollectors: 0,
    completedToday: 0,
  })

  // Environment variable
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  // Custom marker icons
  const createCustomIcon = (color, isStart = false) => {
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${isStart ? 'S' : 'E'}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    })
  }

  // Initialize Leaflet Map
  const initializeMap = () => {
    if (!mapRef.current) return

    try {
      setMapLoading(true)
      
      // Create map instance
      const mapInstance = L.map(mapRef.current, {
        center: [11.0168, 76.9558], // Salem, Tamil Nadu coordinates
        zoom: 12,
        zoomControl: true,
        attributionControl: true
      })

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance)

      setMap(mapInstance)
      setMapLoading(false)
      
      console.log('Map initialized successfully')
    } catch (error) {
      console.error('Error initializing map:', error)
      setMapLoading(false)
      setError('Failed to initialize map')
    }
  }

  // Clear map markers and polylines
  const clearMapLayers = () => {
    if (!map) return

    // Remove all markers
    mapMarkers.forEach(marker => {
      map.removeLayer(marker)
    })
    setMapMarkers([])

    // Remove all polylines
    routePolylines.forEach(polyline => {
      map.removeLayer(polyline)
    })
    setRoutePolylines([])
  }

  // Update map markers
  const updateMapMarkers = (data) => {
    if (!map || !data || data.length === 0) return

    console.log('Updating map markers with data:', data)
    
    // Clear existing markers
    clearMapLayers()

    const newMarkers = []
    const newPolylines = []
    const bounds = L.latLngBounds()

    data.forEach((item) => {
      let hasValidLocation = false

      // Add start marker
      if (item.latitudeStart && item.longitudeStart) {
        try {
          const startLat = parseFloat(item.latitudeStart)
          const startLng = parseFloat(item.longitudeStart)
          
          if (!isNaN(startLat) && !isNaN(startLng)) {
            const startMarker = L.marker([startLat, startLng], {
              icon: createCustomIcon('#10b981', true)
            }).addTo(map)

            startMarker.bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #1e293b;">${item.sampleCollector}</h4>
                <p style="margin: 0; color: #10b981; font-size: 12px; font-weight: 600;">START LOCATION</p>
                <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">
                  ${item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A'}
                </p>
              </div>
            `)

            newMarkers.push(startMarker)
            bounds.extend([startLat, startLng])
            hasValidLocation = true
          }
        } catch (e) {
          console.error('Error adding start marker:', e)
        }
      }

      // Add current/end marker
      const currentLat = item.currentLatitude || item.latitudeEnd
      const currentLng = item.currentLongitude || item.longitudeEnd
      
      if (currentLat && currentLng) {
        try {
          const lat = parseFloat(currentLat)
          const lng = parseFloat(currentLng)
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const isActive = item.isActive
            const currentMarker = L.marker([lat, lng], {
              icon: createCustomIcon(isActive ? '#ef4444' : '#6366f1', false)
            }).addTo(map)

            currentMarker.bindPopup(`
              <div style="padding: 8px; min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #1e293b;">${item.sampleCollector}</h4>
                <p style="margin: 0; color: ${isActive ? '#ef4444' : '#6366f1'}; font-size: 12px; font-weight: 600;">
                  ${isActive ? 'LIVE TRACKING' : 'COMPLETED'}
                </p>
                <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">
                  Distance: ${item.distance_travelled || '0.00'} km
                </p>
                <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">
                  ${isActive ? 'Last Update:' : 'End Time:'} ${new Date(item.lastUpdated || item.endTime).toLocaleString()}
                </p>
              </div>
            `)

            newMarkers.push(currentMarker)
            bounds.extend([lat, lng])
            hasValidLocation = true
          }
        } catch (e) {
          console.error('Error adding current marker:', e)
        }
      }

      // Draw route if available
      if (item.routePoints && Array.isArray(item.routePoints) && item.routePoints.length > 0) {
        try {
          const validRoutePoints = item.routePoints
            .map(point => {
              const lat = parseFloat(point.lat || point.latitude)
              const lng = parseFloat(point.lng || point.longitude)
              return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] : null
            })
            .filter(point => point !== null)

          if (validRoutePoints.length > 1) {
            const routePath = L.polyline(validRoutePoints, {
              color: item.isActive ? '#ef4444' : '#6366f1',
              weight: 4,
              opacity: 0.8
            }).addTo(map)

            routePath.bindPopup(`
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 8px 0; color: #1e293b;">${item.sampleCollector} - Route</h4>
                <p style="margin: 0; color: #374151; font-size: 13px;">
                  Total Distance: ${item.distance_travelled || '0.00'} km
                </p>
                <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">
                  Route Points: ${validRoutePoints.length}
                </p>
              </div>
            `)

            newPolylines.push(routePath)
            
            // Extend bounds to include route
            validRoutePoints.forEach(point => bounds.extend(point))
            hasValidLocation = true
          }
        } catch (e) {
          console.error('Error drawing route:', e)
        }
      }
    })

    setMapMarkers(newMarkers)
    setRoutePolylines(newPolylines)

    // Fit map to show all markers if we have valid locations
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }

    console.log(`Added ${newMarkers.length} markers and ${newPolylines.length} routes to map`)
  }

  // API functions
  const fetchCollectorsByDate = async (date) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching data for date:', date)
      
      const response = await axios.get(`${Labbaseurl}sample_collector_location/`, {
        params: { date: date },
      })

      console.log('API Response:', response.data)

      if (response.data.success) {
        const locationData = response.data.data || []

        const transformedData = locationData.map((item) => ({
          id: item.id,
          sampleCollector: item.sampleCollector,
          date: new Date(item.date).toISOString().split("T")[0],
          latitudeStart: item.latitudeStart,
          longitudeStart: item.longitudeStart,
          latitudeEnd: item.latitudeEnd,
          longitudeEnd: item.longitudeEnd,
          distance_travelled: item.distance_travelled || "0.00",
          startTime: item.startTime,
          endTime: item.endTime,
          totalDuration: item.totalDuration,
          isActive: item.isActive,
          currentLatitude: item.currentLatitude,
          currentLongitude: item.currentLongitude,
          lastUpdated: item.lastUpdated,
          routePoints: typeof item.routePoints === "string" ? JSON.parse(item.routePoints) : item.routePoints || [],
        }))

        console.log('Transformed data:', transformedData)
        setTrackingData(transformedData)
        
        // Update map markers
        if (map && transformedData.length > 0) {
          updateMapMarkers(transformedData)
        }

        // Update stats for selected date
        const activeCount = transformedData.filter((item) => item.isActive).length
        const completedCount = transformedData.filter((item) => !item.isActive && item.endTime).length

        setStats({
          totalCollectors: transformedData.length,
          activeCollectors: activeCount,
          completedToday: completedCount,
        })

      } else {
        setError(response.data.message || "No data found for selected date")
        setTrackingData([])
        setStats({
          totalCollectors: 0,
          activeCollectors: 0,
          completedToday: 0,
        })
      }
    } catch (err) {
      console.error("Error fetching data for date:", err)
      setError("Failed to fetch data for selected date.")
      setTrackingData([])
      setStats({
        totalCollectors: 0,
        activeCollectors: 0,
        completedToday: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  // Initialize map on component mount
  useEffect(() => {
    initializeMap()
    
    // Cleanup function
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Fetch data when date changes
  useEffect(() => {
    if (Labbaseurl && selectedDate) {
      fetchCollectorsByDate(selectedDate)
    }
  }, [selectedDate, Labbaseurl])

  // Update map markers when data changes
  useEffect(() => {
    if (map && trackingData.length > 0) {
      updateMapMarkers(trackingData)
    }
  }, [map, trackingData])

  // Auto-refresh for live tracking (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Labbaseurl && selectedDate) {
        const today = new Date().toISOString().split("T")[0]
        if (selectedDate === today) {
          fetchCollectorsByDate(selectedDate)
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [selectedDate, Labbaseurl])

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDuration = (duration) => {
    return duration || "In Progress"
  }

  const handleRefresh = () => {
    if (Labbaseurl && selectedDate) {
      fetchCollectorsByDate(selectedDate)
    }
  }

  const handleViewRoute = (item) => {
    if (!map) return

    // Find the collector's markers and route
    let targetBounds = null

    if (item.latitudeStart && item.longitudeStart) {
      const startLat = parseFloat(item.latitudeStart)
      const startLng = parseFloat(item.longitudeStart)
      
      if (!isNaN(startLat) && !isNaN(startLng)) {
        targetBounds = L.latLngBounds()
        targetBounds.extend([startLat, startLng])
      }
    }

    const currentLat = item.currentLatitude || item.latitudeEnd
    const currentLng = item.currentLongitude || item.longitudeEnd
    
    if (currentLat && currentLng) {
      const lat = parseFloat(currentLat)
      const lng = parseFloat(currentLng)
      
      if (!isNaN(lat) && !isNaN(lng)) {
        if (!targetBounds) {
          targetBounds = L.latLngBounds()
        }
        targetBounds.extend([lat, lng])
      }
    }

    // Include route points in bounds
    if (item.routePoints && Array.isArray(item.routePoints) && item.routePoints.length > 0) {
      item.routePoints.forEach(point => {
        const lat = parseFloat(point.lat || point.latitude)
        const lng = parseFloat(point.lng || point.longitude)
        
        if (!isNaN(lat) && !isNaN(lng)) {
          if (!targetBounds) {
            targetBounds = L.latLngBounds()
          }
          targetBounds.extend([lat, lng])
        }
      })
    }

    // Fit map to show the route
    if (targetBounds && targetBounds.isValid()) {
      map.fitBounds(targetBounds, { padding: [50, 50] })
    } else if (item.latitudeStart && item.longitudeStart) {
      // Fallback to centering on start location
      const startLat = parseFloat(item.latitudeStart)
      const startLng = parseFloat(item.longitudeStart)
      
      if (!isNaN(startLat) && !isNaN(startLng)) {
        map.setView([startLat, startLng], 15)
      }
    }
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>
            <Navigation size={28} />
            Live Sample Collector Tracking
          </Title>
          <Subtitle>Real-time monitoring and historical tracking of all sample collectors</Subtitle>
        </Header>

        {error && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              marginBottom: "1.5rem",
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard>
            <StatIcon color="#6366f1">
              <Users size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.totalCollectors}</StatValue>
              <StatLabel>Collectors on {selectedDate}</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon color="#10b981">
              <Activity size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.activeCollectors}</StatValue>
              <StatLabel>Currently Active</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon color="#f59e0b">
              <Timer size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.completedToday}</StatValue>
              <StatLabel>Completed on Date</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Map Section */}
        <MapSection>
          <MapHeader>
            <MapTitle>
              <MapIcon size={20} />
              Live Location Map
            </MapTitle>
            <MapControls>
              <Button onClick={handleRefresh} disabled={loading}>
                <RefreshCw size={16} />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </MapControls>
          </MapHeader>

          <MapContainer>
            {mapLoading && (
              <MapLoadingOverlay>
                <LoadingSpinner>
                  <Loader size={24} />
                  Loading Map...
                </LoadingSpinner>
              </MapLoadingOverlay>
            )}
            
            <MapElement ref={mapRef} />
          </MapContainer>
        </MapSection>

        {/* Table Section */}
        <TableSection>
          <TableHeader>
            <TableTitle>
              <Calendar size={20} />
              Sample Collector History
            </TableTitle>
            <DateFilter>
              <Filter size={16} color="#6b7280" />
              <DateInput type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </DateFilter>
          </TableHeader>

          {loading ? (
            <EmptyState>
              <LoadingSpinner>
                <RefreshCw size={24} />
                Loading collector data...
              </LoadingSpinner>
            </EmptyState>
          ) : trackingData.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table>
                <thead>
                  <tr>
                    <Th>Collector Name</Th>
                    <Th>Status</Th>
                    <Th>Start Time</Th>
                    <Th>End Time</Th>
                    <Th>Duration</Th>
                    <Th>Distance (km)</Th>
                    <Th>Last Updated</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {trackingData.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <MapPin size={16} color="#6366f1" />
                          {item.sampleCollector}
                        </div>
                      </Td>
                      <Td>
                        <StatusBadge status={item.isActive ? "active" : "completed"}>
                          {item.isActive ? (
                            <>
                              <Activity size={12} />
                              Live Tracking
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              Completed
                            </>
                          )}
                        </StatusBadge>
                      </Td>
                      <Td>{formatDateTime(item.startTime)}</Td>
                      <Td>{formatDateTime(item.endTime)}</Td>
                      <Td>{formatDuration(item.totalDuration)}</Td>
                      <Td>{item.distance_travelled || "0.00"}</Td>
                      <Td>{formatDateTime(item.lastUpdated)}</Td>
                      <Td>
                        <ViewButton onClick={() => handleViewRoute(item)}>
                          <Eye size={14} />
                          View Route
                        </ViewButton>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <EmptyState>
              <Calendar size={48} color="#94a3b8" />
              <h3>No data found for selected date</h3>
              <p>Try selecting a different date to view tracking history</p>
            </EmptyState>
          )}
        </TableSection>
      </Container>
    </>
  )
}

export default LiveTrackingDashboard