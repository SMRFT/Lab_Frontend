import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f5fa;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-weight: 600;
  color: #2d3748;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4a5568;
  }
  
  &:focus {
    outline: none;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.25rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9375rem;
  color: #4a5568;
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
  accent-color: #4299e1;
  height: 1rem;
  width: 1rem;
`;

const SubmitButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3182ce;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const SampleCollectorForm = ({ show, setShow, onSampleCollectorAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        phone: '',
        email: ''
    });
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSampleCollectorSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${Labbaseurl}sample-collector/`, formData);
            alert('Sample Collector saved successfully!');
            setShow(false);
            onSampleCollectorAdded();
        } catch (error) {
            console.error('Error saving sample collector:', error.response?.data || error);
            alert('Error saving sample collector. Please try again.');
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    return (
        <ModalOverlay show={show}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>Add Sample Collector</ModalTitle>
                    <CloseButton onClick={handleClose}>×</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter collector's name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup>
                            <Label>Gender</Label>
                            <RadioGroup>
                                <RadioLabel>
                                    <RadioInput
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        onChange={handleChange}
                                        required
                                        checked={formData.gender === 'male'}
                                    />
                                    Male
                                </RadioLabel>
                                
                                <RadioLabel>
                                    <RadioInput
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        onChange={handleChange}
                                        checked={formData.gender === 'female'}
                                    />
                                    Female
                                </RadioLabel>
                                
                                <RadioLabel>
                                    <RadioInput
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        onChange={handleChange}
                                        checked={formData.gender === 'other'}
                                    />
                                    Other
                                </RadioLabel>
                            </RadioGroup>
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Enter phone number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        
                        <SubmitButton type="submit" onClick={handleSampleCollectorSave}>
                            Save Collector
                        </SubmitButton>
                    </Form>
                </ModalBody>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default SampleCollectorForm;