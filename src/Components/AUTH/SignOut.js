import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const SignOutContainer = styled.div`
  position: relative;
  display: flex;
`;

const UserAvatar = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

// Modified to appear above the icon
const UserMenu = styled.div`
  position: absolute;
  bottom: 60px; // Position above the avatar
  right: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const UserInfo = styled.div`
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
`;

const UserRole = styled.div`
  font-size: 14px;
  color: #666;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  background: ${props => props.primary ? 'linear-gradient(to right, #8b5cf6, #ec4899)' : '#f8f9fa'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  margin-top: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.primary ? '500' : '400'};
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(to right, #7c4fe4, #db3d87)' : '#e9ecef'};
    transform: translateY(-1px);
  }
  
  svg {
    margin-right: 8px;
  }
`;

// Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }
`;

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
`;

// Function to create a portal for modals and toasts
const Portal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById('modal-root') || document.body
  );
};

const SignOut = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Get user information from localStorage
    const name = localStorage.getItem('name') || 'User';
    const role = localStorage.getItem('role') || 'Guest';
    
    setUserName(name);
    setUserRole(role);
    setUserInitial(name.charAt(0).toUpperCase());
    
    // Close menu if clicked outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    
    // Show success message
    toast.success("Signed out successfully!", { autoClose: 2000 });
    
    // Redirect to login after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  const handleOpenChangePassword = () => {
    setShowMenu(false);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form and errors
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    
    // Clear the error for this field when user starts typing
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };
  
  const validatePasswordForm = () => {
    let valid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
      valid = false;
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
      valid = false;
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      valid = false;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmitPasswordChange = (e) => { 
    e.preventDefault(); 
     
    if (!validatePasswordForm()) { 
      return; 
    } 
     
    // Prepare request data 
    const requestData = { 
      name: userName, 
      role: userRole,  // Include role to uniquely identify the user
      password: passwordForm.newPassword, 
      confirmPassword: passwordForm.confirmPassword, 
      oldPassword: passwordForm.oldPassword 
    }; 
     
    // Send request to change password
    axios.put(`${Labbaseurl}registration/`, requestData) 
      .then(response => { 
        toast.success("Password changed successfully!", { autoClose: 3000 }); 
        handleCloseModal(); 
      }) 
      .catch(error => { 
        if (error.response && error.response.data && error.response.data.error) { 
          // Handle specific error from the backend 
          if (error.response.data.error === "Incorrect current password") { 
            setErrors({ 
              ...errors, 
              oldPassword: "Current password is incorrect" 
            }); 
          } else { 
            toast.error(error.response.data.error, { autoClose: 3000 }); 
          } 
        } else { 
          toast.error("An error occurred. Please try again.", { autoClose: 3000 }); 
        } 
      }); 
  };

  return (
    <>
      <SignOutContainer ref={menuRef}>
        <UserAvatar onClick={() => setShowMenu(!showMenu)}>
          {userInitial}
        </UserAvatar>
        
        {showMenu && (
          <UserMenu>
            <UserInfo>
              <UserName>{userName}</UserName>
              <UserRole>{userRole}</UserRole>
            </UserInfo>
            
            <MenuButton onClick={handleOpenChangePassword}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Change Password
            </MenuButton>
            
            <MenuButton primary onClick={handleSignOut}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </MenuButton>
          </UserMenu>
        )}
      </SignOutContainer>
      
      {/* Portal for modal and toast container */}
      <Portal>
        <ToastContainer position="top-right" autoClose={3000} />
        
        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Change Password</ModalTitle>
                <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleSubmitPasswordChange}>
                <FormGroup>
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                  />
                  {errors.oldPassword && <ErrorText>{errors.oldPassword}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                  />
                  {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                  />
                  {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                </FormGroup>
                
                <MenuButton primary type="submit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Change Password
                </MenuButton>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </Portal>
    </>
  );
};

export default SignOut;