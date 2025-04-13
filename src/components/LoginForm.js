import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { loginUser } from '../firebase';

// Sound effect for button click
const buttonClickSound = new Audio();
buttonClickSound.src = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';

const LoginForm = ({ switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    try {
      // Login user with Firebase
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        setSuccess(true);
        console.log('Login successful:', result.user);
        // Redirect to dashboard or home page would happen here
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
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <GlowingTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        SYSTEM ACCESS
      </GlowingTitle>
      
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Access granted</SuccessMessage>}
        
        <InputGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Label htmlFor="email">IDENTIFIER</Label>
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
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Label htmlFor="password">ACCESS KEY</Label>
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

        <ButtonContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--neon-blue)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'VERIFYING...' : 'AUTHENTICATE'}
          </SubmitButton>
        </ButtonContainer>
        
        <LinksContainer>
          <ForgotPassword
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{ opacity: 1, scale: 1.02 }}
          >
            Reset Access Key
          </ForgotPassword>
          
          <RegisterLink
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            whileHover={{ opacity: 1, scale: 1.02 }}
            onClick={switchToRegister}
            disabled={loading}
          >
            New Identity
          </RegisterLink>
        </LinksContainer>
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
    background: linear-gradient(90deg, var(--neon-purple), var(--neon-blue), var(--neon-green));
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
  text-shadow: 0 0 8px var(--neon-blue), 0 0 12px rgba(0, 180, 216, 0.5);
  letter-spacing: 2px;
  animation: flicker 4s infinite alternate;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
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
    background-color: var(--neon-blue);
    box-shadow: 0 0 8px var(--neon-blue);
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

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
`;

const ForgotPassword = styled(motion.a)`
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: var(--neon-blue);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const RegisterLink = styled(motion.a)`
  font-size: 0.9rem;
  color: var(--neon-purple);
  text-decoration: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  position: relative;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: var(--neon-purple);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

export default LoginForm; 