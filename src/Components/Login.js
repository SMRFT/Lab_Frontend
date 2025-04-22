import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import '@fontsource/poppins';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from './Images/logo.png';
import logo1 from './Images/smrft_logo.png';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// Keyframes for background animation
import { Baseline as Helix } from 'lucide-react';

// Animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const LoginPage = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #06b6d4, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://img.freepik.com/free-photo/examining-sample-with-microscope_1098-18424.jpg?t=st=1740405378~exp=1740408978~hmac=e2f08718838e2afc800c0a00958a27dd4981b4cd3a5610a13cfb1a86c04ec64c&w=2000') center/cover;
    opacity: 0.1;
    z-index: 1;
  }
`;

const flip = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
`;

const DNAButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  opacity: ${props => props.show ? 0 : 1};
  transform: ${props => props.show ? 'scale(0)' : 'scale(1)'};

  &::before {
    content: '';
    position: absolute;
    inset: -10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    filter: blur(15px);
    transition: all 0.3s ease;
  }

  &:hover {
    transform: ${props => props.show ? 'scale(0)' : 'scale(1.05)'};
    
    &::before {
      filter: blur(25px);
    }

    img {
      animation: ${flip} 1s ease-in-out;
    }
  }

  img {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease;
  }
`;

const LoginContainer = styled.div`
  position: absolute;
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.5s ease;
  z-index: ${props => props.show ? 3 : -1};
  animation: ${props => props.show ? fadeIn : 'none'} 0.5s ease;
`;

const Title = styled.h1`
  color: #1a1a1a;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 100px;
    height: 108px;
    color: #8b5cf6;
  }
`;
const TogglePassword = styled.span`
  position: absolute;
  right: 10px;
  margin-top: 16px;
  cursor: pointer;
  font-size: 18px;
`;
// Main Component
const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const navigateRole = (role) => {


    switch (role) {
        case 'Admin':
        navigate('/Dashboard');
        break;
      case 'Receptionist':
        navigate('/PatientForm');
        break;
      case 'General Manager':
          navigate('/Dashboard');
          break;
      case 'Technician':
        navigate('/SampleStatusUpdate');
        break;
      case 'Doctor':
        navigate('/PatientList');
        break;
      case 'Sales Person':
          navigate('/SalesVisitLog');
          break;
      case 'Sample Collector':
          navigate('/LogisticManagementApproval');
          break;
      case 'Accounts':
          navigate('/Invoice');
          break;
      case 'Front Office':
            navigate('/PatientBilling');
            break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://lab.shinovadatabase.in/login/', formData)
      .then((response) => {
        setMessage(response.data.message);
        toast.success("Login Successfully!", { autoClose: 3000 });
  
        const userRole = response.data.role;
        const userName = response.data.name;
        localStorage.setItem('role', userRole);
        localStorage.setItem('name', userName);
  
        // Delay navigation to allow the toast to be visible
        setTimeout(() => {
          navigateRole(userRole);
        }, 3000); // Delay matches the toast duration
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setMessage(error.response.data.error);
          toast.error(error.response.data.error, { autoClose: 3000 });
        } else {
          toast.error("An unexpected error occurred. Please try again.", { autoClose: 3000 });
        }
      });
  };
  
  
  return (
<LoginPage>
<ToastContainer position="top-right" autoClose={3000} />
  <DNAButton show={showLogin} onClick={() => setShowLogin(true)}>
    <img src={logo1} alt="Logo" style={{ width: "50px", height: "50px" }} />
  </DNAButton>

  <LoginContainer show={showLogin}>

    <IconContainer>
      <img src={logo} alt="Logo" style={{ width: "250px", height: "90px" }} />
    </IconContainer>

    <form onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TogglePassword onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "🙈" : "👁️"}
        </TogglePassword>
      </FormGroup>

      <SubmitButton type="submit">Log In</SubmitButton>
    </form>
  </LoginContainer>
</LoginPage>

  );
};
export default Login;