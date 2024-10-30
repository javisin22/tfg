'use client';

import { useEffect, useState } from 'react';

import { User, SendHorizonal } from 'lucide-react';
import Image from 'next/image';
import Loading from '../../../components/Loading';

export default function ChatsScreen() {
  const [userId, setUserId] = useState('');
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch chats and messages for the user logged in
    async function fetchChats() {
      try {
        const response = await fetch('/api/user/chats/getChats');
        const data = await response.json();

        console.log('data:', data);

        if (response.ok) {
          setChats(data.chats);
          setActiveChat(data.chats[0]);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }

    async function getUserInfo() {
      try {
        const res = await fetch('/api/user/info');
        const { user } = await res.json();
        setUserId(user.id);
        console.log('User Info:', user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    fetchChats();
    getUserInfo();
  }, []);

  // Fetch messages for the selected chat
  useEffect(() => {
    async function fetchMessages() {
      if (!activeChat) return;

      try {
        const response = await fetch(`/api/user/chats/getMessages/${activeChat.id}`);
        const data = await response.json();

        console.log('Messages:', data);

        if (response.ok) {
          setMessages(data.messages);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }

    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log('Sending message:', newMessage);

    try {
      const response = await fetch(`/api/user/chats/sendMessage/${activeChat.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
        setNewMessage(''); // Clear the input field
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!chats.length) {
    return <Loading />;
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Chat List */}
      <div className="w-1/3 border rounded-lg shadow-md p-4 bg-white">
        <div className="h-full overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 hover:bg-gray-100 cursor-pointer ${activeChat.id === chat.id ? 'bg-gray-300' : ''}`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="flex items-center space-x-4">
                {chat.profilePicture ? (
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-10 w-10 rounded-full mr-2"
                    width={40}
                    height={40}
                  />
                ) : (
                  <User className="h-10 w-10 rounded-full mr-2 text-black" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-black">{chat.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage && chat.lastMessage[0]
                      ? chat.lastMessage[0].content
                      : 'No messages yet'}
                  </p>
                </div>
                {chat.isGroup && (
                  <div className="bg-primary text-black text-xs px-2 py-1 rounded-full border-2">Group</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col border rounded-lg shadow-md p-4 bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-black">{activeChat.name}</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.senderId === userId ? 'text-right' : ''}`}>
              {activeChat?.isGroup && message.senderId !== userId && (
                <p className="text-xs text-gray-500">{message.sender.username}</p>
              )}
              <div
                className={`inline-block p-2 rounded-lg ${message.senderId === userId ? 'bg-gray-100 text-primary-foreground' : 'bg-gray-300'}`}
              >
                <p className="text-sm text-gray-700">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{new Date(message.timeStamp).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-primary text-black hover:bg-primary-dark"
            >
              <SendHorizonal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
