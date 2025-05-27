import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faCalendarDay, faCalendarWeek, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

const Select = styled.select`
  appearance: none;
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #475569;
  cursor: pointer;
  min-width: 120px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  
  &:hover {
    border-color: #cbd5e1;
  }
`;

const DateInput = styled.input`
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #475569;
  min-width: 150px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  
  &:hover {
    border-color: #cbd5e1;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.primary ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'white'};
  color: ${props => props.primary ? 'white' : '#475569'};
  border: 2px solid ${props => props.primary ? 'transparent' : '#e2e8f0'};
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => props.primary ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : '#f8fafc'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  
  th {
    padding: 1.25rem 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    border-bottom: 2px solid #e2e8f0;
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #f8fafc;
      transform: scale(1.001);
    }
    
    &:not(:last-child) td {
      border-bottom: 1px solid #f1f5f9;
    }
  }
  
  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #475569;
    vertical-align: middle;
  }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 3rem;
    color: #9ca3af;
    font-style: italic;
  }
`;

const LoadingRow = styled(EmptyRow)`
  td {
    color: #3b82f6;
  }
`;

const SummarySection = styled.div`
  margin-top: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SummaryLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const SummaryValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// Utility functions for date handling
const getCurrentDate = () => new Date().toISOString().split('T')[0];

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
};

// Main Component
const SalesVisitLogReport = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [logs, setLogs] = useState([]);
  const [salesMapping, setSalesMapping] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [salespersonVisits, setSalespersonVisits] = useState([]);
  const [filter, setFilter] = useState({
    type: 'date',
    value: getCurrentDate(),
    salesPerson: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesMapping();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = `${Labbaseurl}SalesVisitLog/`;
      const params = {};
      
      if (filter.type === 'date') params.date = filter.value;
      else if (filter.type === 'week') params.week = filter.value;
      else if (filter.type === 'month') params.month = filter.value;
      
      if (filter.salesPerson) params.salesPerson = filter.salesPerson;
      
      const response = await axios.get(url, { params });
      setLogs(response.data);
      updateVisitCounts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const fetchSalesMapping = async () => {
    try {
      const url = `${Labbaseurl}SalesVisitLog/`;
      const response = await axios.get(url);
      
      // Extract unique sales mapping names from response data
      const salesMappingSet = new Set(response.data.map(item => item.salesMapping).filter(Boolean));
      
      // Convert to an array with 'All' option at the beginning
      const salesMappingArray = [
        { id: 0, name: 'All' }, 
        ...Array.from(salesMappingSet).map((name, index) => ({ id: index + 1, name }))
      ];
      
      setSalesMapping(salesMappingArray);
    } catch (error) {
      console.error('Error fetching salesMapping:', error);
    }
  };

  const updateVisitCounts = (data) => {
    const visitCounts = {};
    let total = 0;
    
    data.forEach((log) => {
      const name = log.salesPersonName || log.salesMapping || 'Unknown';
      const visits = parseInt(log.noOfVisits, 10) || 0;
      visitCounts[name] = (visitCounts[name] || 0) + visits;
      total += visits;
    });
    
    // Convert to an array of objects for easier use
    const visitData = Object.entries(visitCounts).map(([name, count]) => ({ name, count }));
    
    // Update state
    setSalespersonVisits(visitData);
    setTotalVisits(total);
  };

  const handleFilterChange = (key, value) => {
    let newFilter = { ...filter, [key]: value };
    
    if (key === 'type') {
      if (value === 'date') newFilter.value = getCurrentDate();
      else if (value === 'week') newFilter.value = getCurrentWeek();
      else if (value === 'month') newFilter.value = getCurrentMonth();
    }
    
    setFilter(newFilter);
  };

  const downloadCSV = () => {
    const csvRows = [
      ['Date', 'Time', 'Clinical Name', 'Salesperson', 'No of Visits', 'Comments'],
      ...logs.map(log => [
        new Date(log.date).toLocaleDateString(),
        log.time || 'N/A',
        log.clinicalname || 'Clinical Name Not Available',
        log.salesPersonName || log.salesMapping || 'N/A',
        log.noOfVisits || 0,
        (log.comments || 'No comments').replace(/,/g, ';'), // Replace commas to avoid CSV issues
      ]),
    ];
    
    const csvContent = csvRows.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_visit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDateForDisplay = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Sales Visit Analytics Dashboard</Title>
      </Header>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faFilter} />
            View by:
          </FilterLabel>
          <Select value={filter.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
            <option value="date">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </Select>
          
          <DateInput
            type={filter.type === 'month' ? 'month' : filter.type === 'week' ? 'week' : 'date'}
            value={filter.value}
            onChange={(e) => handleFilterChange('value', e.target.value)}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faUser} />
            Salesperson:
          </FilterLabel>
          <Select 
            value={filter.salesPerson} 
            onChange={(e) => handleFilterChange('salesPerson', e.target.value)}
          >
            {salesMapping.map((person) => (
              <option key={person.id} value={person.name === 'All' ? '' : person.name}>
                {person.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        
        <Button primary onClick={downloadCSV}>
          <FontAwesomeIcon icon={faDownload} />
          Export CSV
        </Button>
      </FilterContainer>

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th>Clinical Name</th>
              <th>Salesperson</th>
              <th>Date</th>
              <th>Time</th>
              <th>Visits</th>
              <th>Comments</th>
            </tr>
          </TableHead>
          <TableBody>
            {loading ? (
              <LoadingRow>
                <td colSpan={6}>Loading data...</td>
              </LoadingRow>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.clinicalname || 'N/A'}</td>
                  <td>{log.salesMapping || log.salesPersonName || 'N/A'}</td>
                  <td>{formatDateForDisplay(log.date)}</td>
                  <td>{log.time || 'N/A'}</td>
                  <td>{log.noOfVisits || 0}</td>
                  <td>{log.comments || 'No comments'}</td>
                </tr>
              ))
            ) : (
              <EmptyRow>
                <td colSpan={6}>No data available for the selected filters.</td>
              </EmptyRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <SummarySection>
        <SummaryTitle>Performance Summary</SummaryTitle>
        <SummaryGrid>
          <SummaryCard>
            <SummaryLabel>Total Visits</SummaryLabel>
            <SummaryValue>{totalVisits}</SummaryValue>
          </SummaryCard>
          
          {salespersonVisits.length > 0 && salespersonVisits.map((person, index) => (
            <SummaryCard key={index}>
              <SummaryLabel>{person.name}</SummaryLabel>
              <SummaryValue>{person.count}</SummaryValue>
              <SummaryLabel>visits</SummaryLabel>
            </SummaryCard>
          ))}
        </SummaryGrid>
      </SummarySection>
    </PageContainer>
  );
};

export default SalesVisitLogReport;