import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getGroupChatMessages, sendMessageToGroupChat } from '../../firebase';
import { useAuth } from '../AuthContext';

const GroupChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  
  // Get group chat messages
  useEffect(() => {
    const unsubscribe = getGroupChatMessages((newMessages) => {
      setMessages(newMessages);
    });
    
    return () => unsubscribe();
  }, []);
  
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
      await sendMessageToGroupChat(message, currentUser);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <ChatContainer>
      <ChatHeader>
        <Title>GROUP CHAT</Title>
        <Subtitle>{messages.length} Messages</Subtitle>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            isMine={msg.uid === currentUser.uid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {msg.uid !== currentUser.uid && (
              <MessageSender>{msg.displayName}</MessageSender>
            )}
            <MessageText>{msg.text}</MessageText>
            <MessageTime>
              {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </MessageTime>
          </MessageBubble>
        ))}
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
`;

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 0 8px var(--neon-blue);
`;

const Subtitle = styled.div`
  font-size: 0.8rem;
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

const MessageSender = styled.div`
  font-size: 0.75rem;
  color: var(--neon-purple);
  margin-bottom: 0.2rem;
  font-weight: 500;
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

export default GroupChat; 