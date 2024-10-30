import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);

  const createChat = async (userId) => { // userId is the user to create a chat with
    try {
      const response = await fetch('/api/user/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setChats((prevChats) => [...prevChats, data.chat]);
        return data.chat;
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat, createChat, chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
