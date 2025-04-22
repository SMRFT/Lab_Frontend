"use client"

import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { Calendar, TrendingUp, BarChart3, Loader2, User, Filter } from "lucide-react"

const LogisticsDashboard = () => {
  const [collectors, setCollectors] = useState([])
  const [selectedCollector, setSelectedCollector] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [logisticData, setLogisticData] = useState([])
  const [todayCount, setTodayCount] = useState(0)
  const [mtdCount, setMtdCount] = useState(0)
  const [wtdCount, setWtdCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("https://lab.shinovadatabase.in/sample-collector/")
      .then((response) => response.json())
      .then((data) => {
        const names = data.map((collector) => collector.name)
        setCollectors(names)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching collectors:", error)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedCollector) return

    setIsLoading(true)
    fetch(`https://lab.shinovadatabase.in/logisticdashboard/?sampleCollector=${encodeURIComponent(selectedCollector)}`)
      .then((response) => response.json())
      .then((data) => {
        setLogisticData(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching logistic data:", error)
        setIsLoading(false)
      })
  }, [selectedCollector])

  useEffect(() => {
    if (logisticData.length === 0) return

    const today = new Date()
    const selectedDateObj = new Date(selectedDate)
    const selectedMonthStr = selectedMonth
    let todaySampleCount = 0
    let wtdSampleCount = 0
    let mtdSampleCount = 0

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1)

    logisticData.forEach((item) => {
      const itemDate = new Date(item.date)
      const itemDateStr = itemDate.toISOString().split("T")[0]
      const itemMonthStr = itemDate.toISOString().slice(0, 7)

      if (itemDateStr === selectedDate) todaySampleCount++
      if (itemDate >= startOfWeek && itemDate < today) wtdSampleCount++
      if (itemMonthStr === selectedMonthStr) mtdSampleCount++
    })

    setTodayCount(todaySampleCount)
    setWtdCount(wtdSampleCount)
    setMtdCount(mtdSampleCount)
  }, [logisticData, selectedDate, selectedMonth])

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Logistics Dashboard</h1>
        <p>Track and monitor sample collection metrics</p>
      </DashboardHeader>

      <FilterCard>
        <FilterHeader>
          <Filter size={18} />
          <h3>Filter Options</h3>
        </FilterHeader>
        <FilterForm>
          <FormGroup>
            <Label htmlFor="collector">
              <User size={16} />
              Sample Collector
            </Label>
            <SelectWrapper>
              <Select id="collector" value={selectedCollector} onChange={(e) => setSelectedCollector(e.target.value)}>
                <option value="">-- Select Collector --</option>
                {collectors.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <SelectArrow />
            </SelectWrapper>
          </FormGroup>
        </FilterForm>
      </FilterCard>

      {isLoading ? (
        <LoadingContainer>
          <Loader2 className="spinner" size={40} />
          <p>Loading data...</p>
        </LoadingContainer>
      ) : (
        <StatsContainer>
          <StatCard color="var(--primary-gradient)">
            <StatHeader>
              <h3>Today's Count</h3>
              <Calendar size={20} />
            </StatHeader>
            <DateInput type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <StatValue>{todayCount}</StatValue>
            <StatLabel>Samples Collected</StatLabel>
          </StatCard>

          <StatCard color="var(--secondary-gradient)">
            <StatHeader>
              <h3>Week-to-Date</h3>
              <TrendingUp size={20} />
            </StatHeader>
            <StatValue>{wtdCount}</StatValue>
            <StatLabel>Samples This Week</StatLabel>
          </StatCard>

          <StatCard color="var(--tertiary-gradient)">
            <StatHeader>
              <h3>Month-to-Date</h3>
              <BarChart3 size={20} />
            </StatHeader>
            <DateInput type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
            <StatValue>{mtdCount}</StatValue>
            <StatLabel>Samples This Month</StatLabel>
          </StatCard>
        </StatsContainer>
      )}
    </DashboardContainer>
  )
}

// Animations
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Styled Components
const DashboardContainer = styled.div`
  --primary-gradient: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  --tertiary-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --input-bg: #f8fafc;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius: 12px;
  --radius-sm: 6px;
  
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const DashboardHeader = styled.header`
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }

  p {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
  }
`

const FilterCard = styled.div`
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
`

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
`

const FilterForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const FormGroup = styled.div`
  flex: 1;
  min-width: 250px;
`

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
`

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--input-bg);
  color: var(--text-primary);
  appearance: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`

const SelectArrow = styled.span`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  
  &:after {
    content: '';
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid var(--text-secondary);
    border-bottom: 2px solid var(--text-secondary);
    transform: rotate(45deg);
  }
`

const DateInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--input-bg);
  color: var(--text-primary);
  margin: 0.5rem 0;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
`

const StatCard = styled.div`
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: ${(props) => props.color};
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  color: var(--text-primary);
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  
  .spinner {
    animation: ${spin} 1.5s linear infinite;
    color: #4f46e5;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary);
  }
`

export default LogisticsDashboard

