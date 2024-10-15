'use client';

import { useState } from 'react';
import Feed from '../../components/Feed/Feed';
import { CreatePostScreen } from '../../components/Feed/CreateNewPost';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('Home');

  const handleCreatePost = () => {
    setActiveTab('create-post');
  };

  const handleCloseCreatePost = () => {
    setActiveTab('Home');
  };

  return (
    <div className="h-screen">
      {activeTab === 'Home' && <Feed onCreatePost={handleCreatePost} />}
      {activeTab === 'create-post' && <CreatePostScreen onClose={handleCloseCreatePost} />}
    </div>
  );
}
