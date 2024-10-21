'use client';

import { useState } from 'react';

import { User, SendHorizonal } from 'lucide-react';
import Image from 'next/image';

export default function ChatsScreen() {
  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'See you at the gym!',
      isGroup: false,
    },
    {
      id: 2,
      name: 'Running Club',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: "Who's up for a group run this weekend?",
      isGroup: true,
    },
    {
      id: 3,
      name: 'David Lee',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Thanks for the workout tips!',
      isGroup: false,
    },
    {
      id: 4,
      name: 'Yoga Enthusiasts',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'New yoga session scheduled for tomorrow',
      isGroup: true,
    },
  ];

  const [activeChat, setActiveChat] = useState(chats[0]);

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hey! Are we still on for our workout session today?',
      timestamp: '10:30 AM',
    },
    { id: 2, sender: 'You', content: "I'll meet you at the gym at 5 PM.", timestamp: '10:32 AM' },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: "Perfect! Don't forget to bring your resistance bands.",
      timestamp: '10:33 AM',
    },
    { id: 4, sender: 'You', content: 'Got it! See you soon. 💪', timestamp: '10:35 AM' },
  ];

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
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.isGroup && (
                  <div className="bg-primary text-black text-xs px-2 py-1 rounded-full border-2">
                    Group
                  </div>
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
            <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-2 rounded-lg ${message.sender === 'You' ? 'bg-gray-100 text-primary-foreground' : 'bg-gray-300'}`}
              >
                <p className="text-sm text-gray-700">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="p-2 rounded-full bg-primary text-black hover:bg-primary-dark">
              <SendHorizonal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
