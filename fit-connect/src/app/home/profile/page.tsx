'use client';

import { useState, useEffect } from 'react';
import { User, Heart, MessageSquareMore, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { Post } from '../../../types';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await fetch('/api/user/info');
        const { user } = await res.json();
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    async function fetchUserPosts() {
      try {
        const res = await fetch('/api/user/posts/getPosts');
        const { posts } = await res.json();
        console.log('User Posts:', posts);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }

    fetchUserInfo();
    fetchUserPosts();
    setUsername(Cookies.get('username') || '');
  }, []);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      const res = await fetch(`/api/user/posts/update/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      setUserPosts(userPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/user/posts/deletePost/${postId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      console.log('data:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      setUserPosts(userPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto p-6 space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-4">
          {userInfo?.profilePicture ? (
            <Image
              src={userInfo.profilePicture}
              alt="Profile Picture"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full text-gray-700"
            />
          ) : (
            <User className="h-24 w-24 rounded-full text-gray-700" />
          )}
          <h2 className="text-2xl text-gray-500 font-bold text-primary">{username}</h2>
          <p className="text-sm text-gray-500">{userInfo?.biography}</p>
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
              {userInfo?.profilePicture ? (
                <Image
                  src={userInfo.profilePicture}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full text-gray-700"
                />
              ) : (
                <User className="h-10 w-10 rounded-full text-gray-700" />
              )}
              <div>
                <p className="text-sm font-medium text-black">{username}</p>
                {/* 🎃 Cambiar tema de la fecha de publicación (atributo 'postedAt' en cada post de userPosts) */}
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => handleEditPost(post)}>
                <Pencil className="h-4 w-4 text-gray-600" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          <Image src={post.media} alt="Post" className="rounded-md mb-4" width={400} height={300} />
          <p className="text-sm text-gray-700">{post.description}</p>
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
            <p className="text-sm text-gray-500">
              Make changes to your post here. Click save when you're done.
            </p>
            {/* 🎃 Settear un mínimo y máximo del textarea */}
            <textarea
              className="w-full h-24 p-2 border text-black border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={editingPost.description}
              onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
            />
            <div className="flex justify-center items-center">
              <Image src={editingPost.media} alt="Post" className=" rounded-md" width={400} height={300} />
            </div>
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
