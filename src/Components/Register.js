import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Modern styled components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f7f9fc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Card = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  position: relative;
  background-image: url(${require('../Components/Images/register-image.png')});
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
  }
  
  @media (max-width: 900px) {
    height: 240px;
  }
`;

const ContentOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem;
  z-index: 2;
  color: white;
  
  @media (max-width: 900px) {
    padding: 1.5rem;
  }
`;

const ImageTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 900px) {
    font-size: 1.8rem;
  }
`;

const ImageSubtitle = styled.p`
  font-size: 1.1rem;
  margin-top: 0.5rem;
  opacity: 0.9;
  max-width: 400px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 900px) {
    font-size: 1rem;
    margin-top: 0.25rem;
  }
`;

const FormSection = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 900px) {
    padding: 2rem 1.5rem;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const Form = styled.form`
  width: 100%;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  height: 48px;
  background-color: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
    background-color: white;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  height: 48px;
  background-color: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23464646' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
    background-color: white;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #3a56d4;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.3);
  }
`;

const Message = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  color: ${props => props.success ? '#155724' : '#721c24'};
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
  display: ${props => props.visible ? 'block' : 'none'};
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setSuccess(false);
      return;
    }

    const requestData = {
      name: formData.name,
      role: formData.role,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    axios.post('https://lab.shinovadatabase.in/registration/', requestData)
      .then((response) => {
        setMessage('Registration successful!');
        setSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          role: '',
          password: '',
          confirmPassword: ''
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setMessage(error.response.data.error || 'Registration failed. Please try again.');
        } else {
          setMessage('Registration failed. Please try again.');
        }
        setSuccess(false);
        console.error(error);
      });
  };

  return (
    <PageContainer>
      <Card>
        <ImageSection>
          <ContentOverlay>
            {/* <ImageTitle>Welcome to ShinovaLab</ImageTitle> */}
            {/* <ImageSubtitle>Create your account to get started with the system</ImageSubtitle> */}
          </ContentOverlay>
        </ImageSection>
        
        <FormSection>
          <FormHeader>
            <Title>Create an Account</Title>
            <Subtitle>Please fill in the form to register</Subtitle>
          </FormHeader>
          
          <Form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="role">Select Role</Label>
                <Select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="General Manager">General Manager</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Technician">Technician</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Sales Person">Sales Person</option>
                  <option value="Sample Collector">Sample Collector</option>
                  <option value="Front Office">Front Office</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormGrid>
            
            <SubmitButton type="submit">Create Account</SubmitButton>
          </Form>
          
          <Message visible={message !== ''} success={success}>
            {message}
          </Message>
        </FormSection>
      </Card>
    </PageContainer>
  );
};

export default Register;