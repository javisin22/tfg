'use client';

import { useState } from 'react';
import Feed from '../../components/Feed/Feed';

function CreatePostScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      {/* Post creation form */}
      <textarea className="w-full border border-gray-300 p-2 rounded-md mb-4" placeholder="What's on your mind?" />
      <div className="flex justify-end space-x-2">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded" onClick={onClose}>
          Cancel
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Post</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);

  const handleCreatePost = () => {
    setIsCreatingPost(true);
    setActiveTab('create-post');
  };

  const handleCloseCreatePost = () => {
    setIsCreatingPost(false);
    setActiveTab('Home');
  };

  return (
    <div className="h-screen">
      {activeTab === 'Home' && <Feed onCreatePost={handleCreatePost} />}
      {activeTab === 'create-post' && <CreatePostScreen onClose={handleCloseCreatePost} />}
    </div>
  );
}
