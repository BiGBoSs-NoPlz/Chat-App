import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getPrivateMessages, sendPrivateMessage, getUserInfo } from '../../firebase';
import { useAuth } from '../AuthContext';

const PrivateChat = ({ roomId, otherUserId, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  
  // Get user info and chat messages
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await getUserInfo(otherUserId);
        if (result.success) {
          setOtherUser(result.user);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
    
    const unsubscribe = getPrivateMessages(roomId, (newMessages) => {
      setMessages(newMessages);
    });
    
    return () => unsubscribe();
  }, [roomId, otherUserId]);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await sendPrivateMessage(roomId, message, currentUser);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <ChatContainer>
      <ChatHeader>
        <BackButton onClick={onBack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </BackButton>
        
        {loading ? (
          <LoadingTitle>Loading...</LoadingTitle>
        ) : (
          <>
            <UserAvatar status={otherUser?.status || 'offline'}>
              {otherUser?.photoURL ? (
                <img src={otherUser.photoURL} alt={otherUser.displayName} />
              ) : (
                <DefaultAvatar>{otherUser?.displayName?.charAt(0).toUpperCase()}</DefaultAvatar>
              )}
            </UserAvatar>
            <UserInfo>
              <Title>{otherUser?.displayName}</Title>
              <Subtitle>
                {otherUser?.status === 'online' ? 'ACTIVE NOW' : 'OFFLINE'}
              </Subtitle>
            </UserInfo>
          </>
        )}
      </ChatHeader>
      
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>🔒</EmptyStateIcon>
            <EmptyStateText>Secure channel established</EmptyStateText>
            <EmptyStateSubtext>Messages are end-to-end encrypted</EmptyStateSubtext>
          </EmptyState>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              isMine={msg.uid === currentUser.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageText>{msg.text}</MessageText>
              <MessageTime>
                {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </MessageTime>
            </MessageBubble>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <MessageForm onSubmit={handleSubmit}>
        <MessageInput
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <SendButton
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!message.trim()}
        >
          SEND
        </SendButton>
      </MessageForm>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: rgba(15, 15, 35, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background: rgba(10, 10, 25, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
`;

const BackButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 0.8rem;
  
  &:hover {
    color: var(--text-primary);
  }
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
    border: 2px solid rgba(10, 10, 25, 0.8);
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

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 0 8px var(--neon-blue);
`;

const LoadingTitle = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 auto;
`;

const Subtitle = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--neon-blue);
    border-radius: 3px;
  }
`;

const MessageBubble = styled(motion.div)`
  max-width: 80%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background: ${props => props.isMine 
    ? 'linear-gradient(to right, rgba(0, 180, 216, 0.3), rgba(0, 180, 216, 0.1))' 
    : 'rgba(25, 25, 45, 0.6)'};
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  position: relative;
  margin-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isMine ? 'right: -6px;' : 'left: -6px;'}
    width: 10px;
    height: 10px;
    background: ${props => props.isMine 
      ? 'linear-gradient(to right, rgba(0, 180, 216, 0.3), rgba(0, 180, 216, 0.1))' 
      : 'rgba(25, 25, 45, 0.6)'};
    clip-path: ${props => props.isMine 
      ? 'polygon(0 0, 0% 100%, 100% 100%)' 
      : 'polygon(0 100%, 100% 0, 100% 100%)'};
  }
`;

const MessageText = styled.div`
  color: var(--text-primary);
  font-size: 0.95rem;
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 0.3rem;
  text-align: right;
`;

const MessageForm = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(10, 10, 25, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(30, 30, 50, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.7rem 1rem;
  color: var(--text-primary);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 180, 216, 0.3);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(to right, var(--neon-blue), rgba(0, 180, 216, 0.7));
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 1.2rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 1px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const EmptyStateSubtext = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export default PrivateChat; 