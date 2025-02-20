'use client';

import { useEffect, useState } from 'react';
import { User, Users, SendHorizonal, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Loading from '../../../components/Loading';
import { useChat } from '../../../contexts/ChatContext';
import CreateGroupPopup from '../../../components/CreateGroupPopup';
import InviteToGroupPopup from '../../../components/InviteToGroupPopUp';
import { createClient } from '@/utils/supabase/client';

export default function ChatsScreen() {
  const [userId, setUserId] = useState('');
  const { chats, setChats, activeChat, setActiveChat } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chatId: null });

  // Fetch chats and user info on mount
  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch('/api/user/chats/getChats');
        const data = await response.json();
        console.log('data:', data);
        if (response.ok) {
          setChats(data.chats);
          if (data.chats.length > 0) setActiveChat(data.chats[0]);
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

  // Fetch messages for active chat and subscribe for real-time updates
  useEffect(() => {
    if (!activeChat) return;
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/user/chats/getMessages/${activeChat.id}`);
        const data = await response.json();
        console.log('Messages:', data);
        if (response.ok) {
          setMessages(data.messages);
          setUnreadMessages((prev) => ({ ...prev, [activeChat.id]: false }));
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
    const supabase = createClient();
    const subscription = supabase
      .channel(`chat:${activeChat.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chatId=eq.${activeChat.id}` },
        (payload) => {
          console.log('New message received:', payload.new);
          setMessages((prevMessages) => {
            if (!prevMessages.some((msg) => msg.id === payload.new.id)) {
              return [...prevMessages, payload.new];
            }
            return prevMessages;
          });
          if (activeChat.id !== payload.new.chatId) {
            setUnreadMessages((prev) => ({ ...prev, [payload.new.chatId]: true }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChat]);

  // Subscribe for updates on all chats
  useEffect(() => {
    const supabase = createClient();
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        console.log('New message received in any chat:', payload.new);
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === payload.new.chatId ? { ...chat, lastMessage: payload.new } : chat))
        );
        if (activeChat?.id !== payload.new.chatId) {
          setUnreadMessages((prev) => ({ ...prev, [payload.new.chatId]: true }));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    console.log('Sending message:', newMessage);
    try {
      const response = await fetch(`/api/user/chats/sendMessage/${activeChat.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await response.json();
      if (response.ok) {
        setNewMessage('');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateGroup = async (name, members) => {
    console.log('Creating group chat...');
    try {
      const response = await fetch('/api/user/chats/createGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, members }),
      });
      const data = await response.json();
      if (response.ok) {
        setChats((prevChats) => [...prevChats, data.chat]);
        setIsCreatingGroup(false);
        setActiveChat(data.chat);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeChat || !activeChat.isGroup) return;
    try {
      const response = await fetch(`/api/user/chats/leaveGroup/${activeChat.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== activeChat.id));
        chats[0].id === activeChat.id ? setActiveChat(chats[1] || null) : setActiveChat(chats[0] || null);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleInviteUser = async (chatId, invitedUserId) => {
    try {
      const res = await fetch('/api/user/chats/inviteGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, invitedUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
      } else {
        console.log('Invitation sent:', data);
      }
    } catch (error) {
      console.error('Error inviting user:', error);
    }
    setIsInvitingUser(false);
  };

  const handleContextMenu = (event, chatId) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, chatId });
  };

  const handleToggleReadStatus = () => {
    if (contextMenu.chatId) {
      setUnreadMessages((prev) => ({
        ...prev,
        [contextMenu.chatId]: !prev[contextMenu.chatId],
      }));
    }
    setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
  };

  if (!chats.length) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-120px)]">
      {/* Chat List */}
      <div className="md:w-1/3 w-full border rounded-lg shadow-md p-4 bg-white max-h-[250px] md:max-h-full overflow-y-clip">
        <button
          onClick={() => setIsCreatingGroup(true)}
          className="w-full mb-5 p-2 bg-black hover:bg-gray-800 text-white rounded-md flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Group
        </button>
        <hr className="mb-4 border-gray-300" />
        <div className="h-full overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 hover:bg-gray-100 cursor-pointer ${activeChat?.id === chat.id ? 'bg-gray-300' : ''}`}
              onClick={() => {
                setActiveChat(chat);
                setUnreadMessages((prev) => ({ ...prev, [chat.id]: false }));
              }}
              onContextMenu={(e) => handleContextMenu(e, chat.id)}
            >
              <div className="flex items-center">
                {chat.profilePicture ? (
                  <Image src={chat.avatar} alt={chat.name} className="h-10 w-10 rounded-full mr-2" width={40} height={40} />
                ) : (
                  <User className="h-10 w-10 rounded-full mr-2 text-black" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate text-black ${chat.isInvitation ? 'text-red-600 font-bold' : ''}`}>
                    {chat.isInvitation ? `Invitation: ${chat.name}` : chat.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                  </p>
                </div>
                {chat.isGroup && (
                  <div className="ml-3 border-2 border-black rounded-full p-1">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                )}
                {unreadMessages[chat.id] && <div className="text-sm px-1 py-1 rounded-full">🔴</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col border rounded-lg shadow-md p-4 bg-white mt-4 md:mt-0 md:ml-4 overflow-hidden">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-black">{activeChat?.name}</h2>
          {activeChat?.isGroup && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setIsInvitingUser(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded-md"
              >
                Invite
              </button>
              <button onClick={handleLeaveGroup} className="bg-red-500 hover:bg-red-700 text-white text-sm px-2 py-1 rounded-md">
                Leave
              </button>
            </div>
          )}
        </div>

        {/* If this is an invitation, show Accept/Reject */}
        {activeChat?.isInvitation ? (
          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <p className="text-xl text-red-600 mb-4">You have an invitation to join "{activeChat.name}"</p>
            <div className="space-x-4">
              <button
                onClick={async () => {
                  const res = await fetch(`/api/user/chats/acceptInvitation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: activeChat.id }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setChats((prev) => prev.map((c) => (c.id === activeChat.id ? data.chat : c)));
                    setActiveChat(data.chat);
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
              >
                Accept
              </button>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/user/chats/rejectInvitation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: activeChat.id }),
                  });
                  if (res.ok) {
                    setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
                    setActiveChat(chats[1] || null);
                  }
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500">No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`mb-4 ${message.senderId === userId ? 'text-right' : ''}`}>
                    {activeChat?.isGroup && message.senderId !== userId && (
                      <p className="text-xs text-gray-500">{message.sender?.username}</p>
                    )}
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.senderId === userId ? 'bg-gray-100 text-primary-foreground' : 'bg-gray-300'
                      }`}
                    >
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{new Date(message.timeStamp).toLocaleString()}</p>
                  </div>
                ))
              )}
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
                <button onClick={handleSendMessage} className="p-2 rounded-full bg-primary text-black hover:bg-primary-dark">
                  <SendHorizonal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateGroupPopup isOpen={isCreatingGroup} onClose={() => setIsCreatingGroup(false)} onCreateGroup={handleCreateGroup} />

      <InviteToGroupPopup
        isOpen={isInvitingUser}
        onClose={() => setIsInvitingUser(false)}
        onInvite={handleInviteUser}
        chatId={activeChat?.id || ''}
      />

      {contextMenu.visible && (
        <div className="absolute bg-white border rounded shadow-md" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={handleToggleReadStatus} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            {unreadMessages[contextMenu.chatId] ? 'Mark as Read' : 'Mark as Unread'}
          </button>
        </div>
      )}
    </div>
  );
}
