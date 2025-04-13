import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getOnlineUsers } from '../../firebase';
import { useAuth } from '../AuthContext';

const UsersList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const unsubscribe = getOnlineUsers((allUsers) => {
      // Filter out current user from the list
      const filteredUsers = allUsers.filter(user => user.uid !== currentUser.uid);
      setUsers(filteredUsers);
    });
    
    return () => unsubscribe();
  }, [currentUser]);
  
  return (
    <UsersContainer>
      <UsersHeader>
        <Title>USERS</Title>
        <Counter>{users.length} AGENTS</Counter>
      </UsersHeader>
      
      <UserListWrapper>
        <AnimatePresence>
          {users.map(user => (
            <UserItem
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectUser(user)}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 30, 50, 0.8)' }}
            >
              <UserAvatar status={user.status}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} />
                ) : (
                  <DefaultAvatar>{user.displayName?.charAt(0).toUpperCase()}</DefaultAvatar>
                )}
              </UserAvatar>
              
              <UserInfo>
                <UserName>{user.displayName}</UserName>
                <UserStatus status={user.status}>
                  {user.status === 'online' ? 'ACTIVE' : 'OFFLINE'}
                </UserStatus>
              </UserInfo>
              
              <ActionButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChatIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </ChatIcon>
              </ActionButton>
            </UserItem>
          ))}
        </AnimatePresence>
        
        {users.length === 0 && (
          <EmptyState>No other users available</EmptyState>
        )}
      </UserListWrapper>
    </UsersContainer>
  );
};

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 280px;
  background: rgba(15, 15, 35, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const UsersHeader = styled.div`
  padding: 1rem;
  background: rgba(10, 10, 25, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 0 8px var(--neon-purple);
`;

const Counter = styled.div`
  font-size: 0.7rem;
  color: var(--neon-purple);
  background: rgba(157, 78, 221, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(157, 78, 221, 0.3);
`;

const UserListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--neon-purple);
    border-radius: 3px;
  }
`;

const UserItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(25, 25, 45, 0.4);
  transition: background-color 0.2s ease;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.status === 'online' ? '#4ade80' : '#9ca3af'};
    border: 2px solid rgba(15, 15, 35, 0.6);
  }
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  margin-left: 0.8rem;
  flex: 1;
`;

const UserName = styled.div`
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const UserStatus = styled.div`
  font-size: 0.7rem;
  color: ${props => props.status === 'online' ? '#4ade80' : '#9ca3af'};
  margin-top: 0.2rem;
`;

const ActionButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: var(--neon-blue);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  
  &:hover {
    background: rgba(0, 180, 216, 0.1);
  }
`;

const ChatIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-style: italic;
`;

export default UsersList; 