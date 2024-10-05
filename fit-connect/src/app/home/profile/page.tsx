'use client';

import { useState } from 'react';
import { User, Heart, MessageSquareMore, Trash2, Pencil } from 'lucide-react';

export default function ProfileScreen() {
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      image: '/placeholder.svg?height=300&width=400',
      content: 'Just crushed my morning workout! 💪 #MorningMotivation',
      likes: 42,
      comments: 7,
    },
    {
      id: 2,
      image: '/placeholder.svg?height=300&width=400',
      content: 'New personal best in deadlifts today! 🏋️‍♂️ #StrengthTraining',
      likes: 38,
      comments: 5,
    },
    {
      id: 3,
      image: '/placeholder.svg?height=300&width=400',
      content: 'Beautiful day for a run by the beach 🏃‍♀️🌊 #CardioTime',
      likes: 56,
      comments: 9,
    },
  ]);

  const [editingPost, setEditingPost] = useState(null);

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = (updatedPost) => {
    setUserPosts(userPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setEditingPost(null);
  };

  const handleDeletePost = (postId) => {
    setUserPosts(userPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto p-6 space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* <img src="/placeholder.svg?height=96&width=96" alt="Profile Picture" className="h-24 w-24 rounded-full" /> */}
          <User className="h-24 w-24 rounded-full text-gray-700" />
          <h2 className="text-2xl text-gray-500 font-bold text-primary">John Doe</h2>
          <p className="text-sm text-gray-500">Fitness enthusiast | Runner | Weightlifter</p>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{userPosts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">1.2k</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">567</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <h3 className="text-xl font-semibold text-primary mb-4">My Posts</h3>

      {userPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg?height=40&width=40" alt="John Doe" className="h-10 w-10 rounded-full" />
              <div>
                <p className="text-sm font-medium text-primary">John Doe</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => handleEditPost(post)}>
                <Pencil className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => handleDeletePost(post.id)}>
                <Trash2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          <img src={post.image} alt="Post" className="rounded-md mb-4" />
          <p className="text-sm text-gray-700">{post.content}</p>
          <div className="flex space-x-4">
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes} Likes
            </button>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <MessageSquareMore className="h-4 w-4 mr-1" /> 
              {post.comments} Comments
            </button>
          </div>
        </div>
      ))}

      {/* Edit Post Dialog */}
      {editingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-[90%] max-w-lg">
            <h3 className="text-lg font-medium text-gray-900">Edit Post</h3>
            <p className="text-sm text-gray-500">Make changes to your post here. Click save when you're done.</p>
            <textarea
              className="w-full h-24 p-2 border text-black border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={editingPost.content}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
            />
            <img src={editingPost.image} alt="Post" className="rounded-md" />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-black bg-red-500 rounded-lg hover:bg-red-400"
                onClick={() => setEditingPost(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-black bg-green-600 rounded-lg hover:bg-green-400"
                onClick={() => handleUpdatePost(editingPost)}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
