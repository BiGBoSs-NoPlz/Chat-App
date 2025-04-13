import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { registerUser } from '../firebase';

// Sound effect for button click
const buttonClickSound = new Audio();
buttonClickSound.src = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';

const RegisterForm = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    buttonClickSound.play();
    
    // Reset states
    setError('');
    setLoading(true);
    setSuccess(false);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Encryption keys do not match');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Encryption key must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      // Register user with Firebase
      const result = await registerUser(formData.email, formData.password, formData.username);
      
      if (result.success) {
        setSuccess(true);
        // Switch to login after successful registration with delay
        setTimeout(() => {
          switchToLogin();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('System error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <GlowingTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        NEW IDENTITY
      </GlowingTitle>
      
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Identity created successfully!</SuccessMessage>}
        
        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Label htmlFor="username">USERNAME</Label>
          <InputField
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            autoComplete="off"
            disabled={loading}
          />
          <InputLine className="input-line" />
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Label htmlFor="email">E-MAIL</Label>
          <InputField
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="off"
            disabled={loading}
          />
          <InputLine className="input-line" />
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Label htmlFor="password">PASSWORD</Label>
          <InputField
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          <InputLine className="input-line" />
        </InputGroup>

        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Label htmlFor="confirmPassword">VERIFY-PASSWORD</Label>
          <InputField
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          <InputLine className="input-line" />
        </InputGroup>

        <ButtonContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--neon-green)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'PROCESSING...' : 'CREATE'}
          </SubmitButton>
        </ButtonContainer>
        
        <LoginLink
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.02 }}
          onClick={switchToLogin}
          disabled={loading}
        >
          Return to Login
        </LoginLink>
      </Form>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: rgba(15, 15, 35, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  z-index: 2;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    height: 2px;
    background: linear-gradient(90deg, var(--neon-green), var(--neon-blue), var(--neon-purple));
    z-index: 1;
    animation: glowBorder 3s linear infinite;
  }

  @keyframes glowBorder {
    0% { background-position: 0%; }
    100% { background-position: 400%; }
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff5555;
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff99;
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const GlowingTitle = styled(motion.h1)`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-shadow: 0 0 8px var(--neon-green), 0 0 12px rgba(0, 245, 212, 0.5);
  letter-spacing: 2px;
  animation: flicker 4s infinite alternate;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: 0.2rem;
`;

const InputField = styled.input`
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.1rem;
  padding: 0.5rem 0;
  outline: none;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:focus + .input-line {
    width: 100%;
    background-color: var(--neon-green);
    box-shadow: 0 0 8px var(--neon-green);
  }
`;

const InputLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
`;

const ButtonContainer = styled(motion.div)`
  margin-top: 1rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(90deg, var(--primary-light), #16213e);
  color: var(--text-primary);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.5s ease;
  }

  &:hover:before {
    left: 100%;
  }
`;

const LoginLink = styled(motion.a)`
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  align-self: center;
  margin-top: 0.5rem;
  position: relative;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: var(--neon-green);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

export default RegisterForm; 