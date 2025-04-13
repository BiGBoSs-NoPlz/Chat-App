import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { createPrivateChat } from '../../firebase';
import GroupChat from './GroupChat';
import UsersList from './UsersList';
import PrivateChat from './PrivateChat';

const Chat = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('group'); // 'group' or 'private'
  const [privateChat, setPrivateChat] = useState(null);
  
  const handleSelectUser = async (user) => {
    try {
      const result = await createPrivateChat(currentUser, user);
      if (result.success) {
        setPrivateChat({
          roomId: result.roomId,
          otherUserId: user.id
        });
        setActiveTab('private');
      }
    } catch (error) {
      console.error('Error creating private chat:', error);
    }
  };
  
  const handleBackToGroup = () => {
    setActiveTab('group');
    setPrivateChat(null);
  };
  
  return (
    <ChatDashboard>
      <SidePanel>
        <UsersList onSelectUser={handleSelectUser} />
      </SidePanel>
      
      <MainPanel>
        <TabsContainer>
          <Tab 
            active={activeTab === 'group'}
            onClick={() => setActiveTab('group')}
            whileHover={{ backgroundColor: 'rgba(25, 25, 45, 0.6)' }}
          >
            GROUP CHAT
          </Tab>
          {privateChat && (
            <Tab 
              active={activeTab === 'private'}
              onClick={() => setActiveTab('private')}
              whileHover={{ backgroundColor: 'rgba(25, 25, 45, 0.6)' }}
            >
              PRIVATE CHAT
            </Tab>
          )}
        </TabsContainer>
        
        <ContentContainer>
          {activeTab === 'group' && <GroupChat />}
          
          {activeTab === 'private' && privateChat && (
            <PrivateChat 
              roomId={privateChat.roomId}
              otherUserId={privateChat.otherUserId}
              onBack={handleBackToGroup}
            />
          )}
        </ContentContainer>
      </MainPanel>
    </ChatDashboard>
  );
};

const ChatDashboard = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 1.2rem;
`;

const SidePanel = styled.div`
  width: 280px;
  height: 100%;
`;

const MainPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TabsContainer = styled.div`
  display: flex;
  background: rgba(15, 15, 35, 0.6);
  border-radius: 8px 8px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  overflow: hidden;
`;

const Tab = styled(motion.div)`
  padding: 0.8rem 1.5rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  background: ${props => props.active ? 'rgba(25, 25, 45, 0.6)' : 'transparent'};
  cursor: pointer;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.active ? 'var(--neon-blue)' : 'transparent'};
    box-shadow: ${props => props.active ? '0 0 8px var(--neon-blue)' : 'none'};
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  height: calc(100% - 46px); /* Subtract tabs height */
`;

export default Chat; 