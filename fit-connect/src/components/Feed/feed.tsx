'use client';

import Logout from '../Logout';
import { useState } from 'react';
import { Calendar, Dumbbell, HomeIcon, MessageCircle, Settings, User } from 'lucide-react';

export default function Feed() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const handleCreatePost = () => {
    setIsCreatingPost(true);
    setActiveTab('create-post');
  };

  const handleCloseCreatePost = () => {
    setIsCreatingPost(false);
    setActiveTab('home');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64  p-4">
        <h1 className="text-2xl font-bold mb-4">FitConnect</h1>
        <nav className="space-y-2">
          <button
            className={`w-full text-left py-2 px-4 rounded-md ${activeTab === 'home' ? 'bg-gray-100 bg-opacity-35' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-md ${activeTab === 'chats' ? 'bg-gray-100 bg-opacity-35' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-md ${activeTab === 'settings' ? 'bg-gray-100 bg-opacity-35' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-md ${activeTab === 'my-profile' ? 'bg-gray-100 bg-opacity-35' : ''}`}
            onClick={() => setActiveTab('my-profile')}
          >
            My Profile
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 bg-slate-700">
        {activeTab === 'home' && <Logout />}
        {/* {activeTab === 'home' && <HomeScreen onCreatePost={handleCreatePost} />}
        {activeTab === 'chats' && <ChatScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'my-profile' && <MyProfileScreen />}
        {activeTab === 'create-post' && <CreatePostScreen onClose={handleCloseCreatePost} />} */}
      </div>
    </div>
  );

  //   return (
  //     <div>
  //       <h1>Home/feed de la app!!!</h1>
  //       <Logout />
  //     </div>
  //   );
}
