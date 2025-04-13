import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import Background from './components/Background';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { AuthProvider, useAuth } from './components/AuthContext';
import { logoutUser } from './firebase';
import Chat from './components/ChatComponents/Chat';

// Dashboard component for authenticated users
const Dashboard = () => {
  const { currentUser } = useAuth();
  
  const handleLogout = async () => {
    await logoutUser();
  };
  
  return (
    <DashboardContainer>
      <Header>
        <Logo>ENIGMA<LogoSpan>CHAT</LogoSpan></Logo>
        <UserInfo>
          <UserName>{currentUser?.displayName || 'Agent'}</UserName>
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.02, boxShadow: '0 0 10px var(--neon-purple)' }}
            whileTap={{ scale: 0.98 }}
          >
            DISCONNECT
          </LogoutButton>
        </UserInfo>
      </Header>
      
      <ChatContainer>
        <Chat />
      </ChatContainer>
    </DashboardContainer>
  );
};

// Main content component with conditional rendering
const MainContent = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { isAuthenticated } = useAuth();

  const switchToRegister = () => {
    setIsLoginForm(false);
  };

  const switchToLogin = () => {
    setIsLoginForm(true);
  };

  return (
    <ContentContainer>
      {!isAuthenticated && (
        <Logo>
          ENIGMA<LogoSpan>TECH</LogoSpan>
        </Logo>
      )}
      
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <FormWrapper>
          <AnimatePresence mode="wait">
            {isLoginForm ? (
              <LoginForm key="login" switchToRegister={switchToRegister} />
            ) : (
              <RegisterForm key="register" switchToLogin={switchToLogin} />
            )}
          </AnimatePresence>
        </FormWrapper>
      )}
    </ContentContainer>
  );
};

// App component wraps everything with the AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContainer>
        <Background />
        <MainContent />
      </AppContainer>
    </AuthProvider>
  );
};

const AppContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 800px;
  padding: 2rem;
`;

const FormWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  color: var(--text-primary);
  text-shadow: 0 0 10px var(--neon-purple), 0 0 20px rgba(157, 78, 221, 0.5);
  letter-spacing: 4px;
  margin-bottom: 1rem;
  animation: flicker 6s infinite alternate;
`;

const LogoSpan = styled.span`
  color: var(--neon-blue);
  font-size: 2rem;
  text-shadow: 0 0 10px var(--neon-blue), 0 0 20px rgba(0, 180, 216, 0.5);
`;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: var(--neon-purple);
  font-size: 1.1rem;
`;

const LogoutButton = styled(motion.button)`
  background: rgba(25, 25, 45, 0.6);
  color: var(--text-primary);
  border: 1px solid rgba(157, 78, 221, 0.5);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(30, 30, 50, 0.8);
    border-color: var(--neon-purple);
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

export default App; 