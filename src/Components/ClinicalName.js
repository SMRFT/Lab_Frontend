import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Search, AlertCircle } from 'lucide-react';

// Styled Components
const Container = styled.div`
 position: relative;
 width: 100%;
`;

const Label = styled.label`
 display: block;
 margin-bottom: 0.5rem;
 font-weight: 500;
 font-size: 0.875rem;
 color: #555;
`;

const InputContainer = styled.div`
 position: relative;
 display: flex;
 width: 100%;
`;

const SearchInput = styled.input`
 width: 100%;
 padding: 0.75rem 1rem 0.75rem 2.5rem;
 border-radius: 8px;
 border: 1px solid ${props => props.error ? '#ff6b6b' : '#e0e0e0'};
 font-size: 0.875rem;
 transition: all 0.2s;
 
 &:focus {
 outline: none;
 border-color: ${props => props.error ? '#ff6b6b' : '#DB9BB9'};
 box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(255, 107, 107, 0.1)' : 'rgba(219, 155, 185, 0.1)'};
 }
 
 &:disabled {
 background-color: #f9f9f9;
 cursor: not-allowed;
 }
`;

const SearchIcon = styled.div`
 position: absolute;
 left: 0.75rem;
 top: 50%;
 transform: translateY(-50%);
 color: #9e9e9e;
 pointer-events: none;
`;

const Dropdown = styled.div`
 position: absolute;
 top: 100%;
 left: 0;
 width: 100%;
 max-height: 300px;
 overflow-y: auto;
 background: white;
 border-radius: 8px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 z-index: 1000;
 margin-top: 0.25rem;
 
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

const DropdownItem = styled.div`
 padding: 0.75rem 1rem;
 cursor: pointer;
 transition: all 0.2s;
 display: flex;
 align-items: center;
 
 &:hover {
 background-color: #f9f0f4;
 }
 
 .location {
 color: #9e9e9e;
 font-size: 0.75rem;
 margin-left: 0.5rem;
 }
`;

const EmptyItem = styled.div`
 padding: 0.75rem 1rem;
 color: #9e9e9e;
 text-align: center;
`;

const ErrorMessage = styled.div`
 display: flex;
 align-items: center;
 color: #ff6b6b;
 font-size: 0.75rem;
 margin-top: 0.5rem;
 
 svg {
   margin-right: 0.25rem;
 }
`;

const RequiredIndicator = styled.span`
 color: #ff6b6b;
 margin-left: 0.25rem;
`;

// Main Component
const ModernClinicalName = ({ isB2BEnabled, onClinicalNameSelect, onValidChange }) => {
 const [clinicalNames, setClinicalNames] = useState([]);
 const [searchTerm, setSearchTerm] = useState('');
 const [showDropdown, setShowDropdown] = useState(false);
 const [formData, setFormData] = useState({ B2B: '' });
 const [error, setError] = useState('');
 const [touched, setTouched] = useState(false);
 
 const dropdownRef = useRef(null);
 const searchInputRef = useRef(null);

 // Close dropdown when clicking outside
 useEffect(() => {
 const handleClickOutside = (event) => {
   if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
   searchInputRef.current && !searchInputRef.current.contains(event.target)) {
     setShowDropdown(false);
     
     // Set touched to true when the user clicks away
     if (isB2BEnabled && !searchTerm.trim()) {
       setTouched(true);
     }
   }
 };
 
 document.addEventListener('mousedown', handleClickOutside);
 return () => {
   document.removeEventListener('mousedown', handleClickOutside);
 };
 }, [isB2BEnabled, searchTerm]);

 // Fetch clinical names on component mount
 useEffect(() => {
 axios.get('https://lab.shinovadatabase.in/clinical_name/')
   .then((response) => {
     setClinicalNames(response.data);
   })
   .catch((error) => {
     console.error('Error fetching clinical names:', error);
   });
 }, []);

 // Validate when B2B state or searchTerm changes
 useEffect(() => {
   if (isB2BEnabled) {
     if (!searchTerm.trim()) {
       setError('Clinical name is required when B2B is enabled');
       
       // Only notify parent if we've been touched
       if (onValidChange && touched) {
         onValidChange(false);
       }
     } else {
       // Validate that selected option exists in the list
       const exists = clinicalNames.some(name => name.clinicalname === searchTerm);
       if (!exists && searchTerm.trim() !== '') {
         setError('Please select a valid clinical name from the list');
         if (onValidChange) onValidChange(false);
       } else {
         setError('');
         if (onValidChange) onValidChange(true);
       }
     }
   } else {
     setError('');
     if (onValidChange) onValidChange(true);
   }
 }, [isB2BEnabled, searchTerm, clinicalNames, touched, onValidChange]);

 // Reset state when B2B is toggled
 useEffect(() => {
   if (!isB2BEnabled) {
     setSearchTerm('');
     setFormData({ B2B: '' });
     if (onClinicalNameSelect) {
       onClinicalNameSelect('', '', '');
     }
   }
 }, [isB2BEnabled, onClinicalNameSelect]);

 // Filtered Clinical Names Based on Search Term
 const filteredClinicalNames = clinicalNames.filter(name =>
   name.clinicalname.toLowerCase().includes(searchTerm.toLowerCase())
 );

 // Handle clinical name selection
 const handleClinicalOptionChange = (selectedName) => {
   setFormData({ ...formData, B2B: selectedName });
   setSearchTerm(selectedName);
   setShowDropdown(false);
   setTouched(true);

   // Find the selected clinical name object
   const selectedClinical = clinicalNames.find(name => name.clinicalname === selectedName);

   if (selectedClinical && onClinicalNameSelect) {
     onClinicalNameSelect(
       selectedName, 
       selectedClinical.referrerCode, 
       selectedClinical.salesMapping
     );
   }
 };

 // Handle input blur
 const handleBlur = () => {
   setTouched(true);
 };

 return (
   <Container>
     <Label>
       Clinical Name
       {isB2BEnabled && <RequiredIndicator>*</RequiredIndicator>}
     </Label>
     <InputContainer>
       <SearchIcon>
         <Search size={16} />
       </SearchIcon>
       <SearchInput
         ref={searchInputRef}
         type="text"
         placeholder={isB2BEnabled ? "Select Clinical Name (Required)" : "Search Clinical Name..."}
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         onFocus={() => setShowDropdown(true)}
         onBlur={handleBlur}
         disabled={!isB2BEnabled}
         error={isB2BEnabled && touched && error}
       />
     </InputContainer>
     
     {showDropdown && (
       <Dropdown ref={dropdownRef}>
         {filteredClinicalNames.length === 0 ? (
           <EmptyItem>No results found</EmptyItem>
         ) : (
           filteredClinicalNames.map((name, index) => (
             <DropdownItem 
               key={index}
               onClick={() => handleClinicalOptionChange(name.clinicalname)}
             >
               <span>{name.clinicalname}</span>
               {name.location && <span className="location">({name.location})</span>}
             </DropdownItem>
           ))
         )}
       </Dropdown>
     )}
     
     {isB2BEnabled && touched && error && (
       <ErrorMessage>
         <AlertCircle size={12} />
         {error}
       </ErrorMessage>
     )}
   </Container>
 );
};

export default ModernClinicalName;