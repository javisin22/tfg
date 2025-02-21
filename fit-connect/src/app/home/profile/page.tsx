'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Heart, MessageSquareMore, Trash2, Pencil, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../../../types';
import { createClient } from '@/utils/supabase/client';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showWeightInLbs, setShowWeightInLbs] = useState(false);
  const [showHeightInFeetInches, setShowHeightInFeetInches] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await fetch('/api/user/info');
        const { user } = await res.json();
        setUserInfo(user);
        setFollowingCount(user.followingCount);
        setFollowersCount(user.followersCount);
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
    setImagePreview(post.media);
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      let imageUrl = updatedPost.media;

      if (image) {
        imageUrl = await uploadImageToSupabase(image);
        if (!imageUrl) {
          throw new Error('Error uploading image');
        }
      }

      const res = await fetch(`/api/user/posts/update/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedPost, media: imageUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      setUserPosts(userPosts.map((post) => (post.id === updatedPost.id ? { ...updatedPost, media: imageUrl } : post)));
      setEditingPost(null);
      setImage(null);
      setImagePreview(null);
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

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const uploadImageToSupabase = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('post_media').upload(fileName, file);
    if (error) {
      console.error('Error uploading image:', error);
    }

    const publicUrl = supabase.storage.from('post_media').getPublicUrl(fileName);
    console.log('Image uploaded has the publicUrl:', publicUrl.data?.publicUrl);
    return publicUrl.data?.publicUrl;
  };

  const kgToLb = (kg: number) => {
    return (kg * 2.20462).toFixed(2);
  };

  const cmToFeetInches = (cm: number) => {
    const totalInches = cm * 0.393701;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches - feet * 12;
    return `${feet}ft ${inches.toFixed(1)}in`;
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        if (data.action === 'liked') {
          setUserPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes? + 1 : 1 } : post)));
          setLikedPosts((prev) => [...prev, postId]);
        } else if (data.action === 'disliked') {
          setUserPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes? - 1 : 0 } : post)));
          setLikedPosts((prev) => prev.filter((id) => id !== postId));
        }
      }
    } catch (error) {
      console.error('Error liking/disliking post:', error);
    }
  };


  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto p-6 space-y-6">
      {/* Profile Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-4">
          {userInfo?.profilePicture ? (
            <Image
              src={userInfo.profilePicture}
              alt="Profile Picture"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full text-gray-700 object-cover"
            />
          ) : (
            <User className="h-24 w-24 rounded-full text-gray-700" />
          )}
          <h2 className="text-2xl text-gray-500 font-bold text-primary">{username}</h2>
          <p className="text-sm text-gray-500">{userInfo?.biography}</p>
          <div className="space-y-1">
            {userInfo?.weight && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">
                  Weight: {showWeightInLbs ? `${kgToLb(userInfo?.weight as number)} lb` : `${userInfo?.weight} kg`}
                </p>
                <button
                  onClick={() => setShowWeightInLbs(!showWeightInLbs)}
                  className="text-xs text-blue-500 hover:underline focus:outline-none"
                >
                  Show in {showWeightInLbs ? 'kg' : 'lb'}
                </button>
              </div>
            )}
            {userInfo?.height && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">
                  Height: {showHeightInFeetInches ? `${cmToFeetInches(userInfo?.height as number)}` : `${userInfo?.height} cm`}
                </p>
                <button
                  onClick={() => setShowHeightInFeetInches(!showHeightInFeetInches)}
                  className="text-xs text-blue-500 hover:underline focus:outline-none"
                >
                  Show in {showHeightInFeetInches ? 'cm' : 'ft/in'}
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{userPosts.length}</p>
              <p className="text-sm text-gray-500">{userPosts.length === 1 ? 'Post' : 'Posts'}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{followersCount}</p>
              <p className="text-sm text-gray-500">{followersCount === 1 ? 'Follower' : 'Followers'}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{followingCount}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </section>

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
                  className="h-10 w-10 rounded-full text-gray-700 object-cover"
                />
              ) : (
                <User className="h-10 w-10 rounded-full text-gray-700" />
              )}
              <div>
                <p className="text-sm font-medium text-black">{username}</p>
                <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}</p>
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
          <Image src={post.media} alt="Post" className="rounded-md mb-4" width={400} height={300} />
          <p className="text-sm text-gray-700">{post.description}</p>
          <div className="flex space-x-4">
            <button
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              onClick={() => handleLikePost(post.id)}
            >
              <Heart
                className={`mr-1 h-4 w-4 inline-block ${likedPosts.includes(post.id) ? 'text-red-600' : 'text-gray-500'}`}
                fill={likedPosts.includes(post.id) ? 'red' : 'none'}
              />
              {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
            </button>
            <div className="flex items-center text-sm text-gray-500">
              <MessageSquareMore className="h-4 w-4 mr-1" />
              {post.comments?.length} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
            </div>
          </div>
          {/* Post Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div className="px-6 py-4 bg-gray-200 mt-4">
              <h4 className="text-sm font-medium text-black mb-2">Comments</h4>
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-2 mb-2">
                  <Image
                    src={comment.users.profilePicture}
                    alt={`${comment.users.username}'s profile picture`}
                    width="32"
                    height="32"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">{comment.users.username}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-4 bg-gray-200 mt-4">
              <h4 className="text-sm font-medium text-black mb-2">No comments yet</h4>
            </div>
          )}
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
              value={editingPost.description}
              onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
            />
            <div
              className="relative flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors h-64"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleImageUpload(file);
              }}
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image src={imagePreview} alt="Uploaded" layout="fill" objectFit="contain" className="rounded-lg" />
                  <button
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4 text-black" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-black" />
                  <div className="mt-4 flex text-sm leading-6 text-black">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-gray-300 font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          if (file) handleImageUpload(file);
                        }}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1 text-gray-800">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-800">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
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
