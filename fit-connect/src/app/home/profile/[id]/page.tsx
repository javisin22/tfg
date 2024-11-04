'use client';

import { useState, useEffect } from 'react';
import { User, Heart, MessageSquareMore } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Post } from '../../../../types';
import Loading from '../../../../components/Loading';

export default function UserProfile() {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!id) return; // Ensure userId is available

    async function fetchUserInfo() {
      try {
        const res = await fetch(`/api/user/${id}/info`);
        const { user } = await res.json();
        console.log('User Info:', user);
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    async function fetchUserPosts() {
      try {
        const res = await fetch(`/api/user/${id}/posts`);
        const { posts } = await res.json();
        console.log('User Posts:', posts);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }

    fetchUserInfo();
    fetchUserPosts();
  }, [id]);

  if (!userInfo) {
    return <Loading />;
  }

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto p-6 space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center space-y-4">
          {userInfo.profilePicture ? (
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
          <h2 className="text-2xl text-gray-500 font-bold text-primary">{userInfo.username}</h2>
          <p className="text-sm text-gray-500">{userInfo.biography}</p>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{userPosts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            {/* Placeholder follower/following counts */}
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
      <h3 className="text-xl font-semibold text-primary mb-4">{userInfo.username}'s Posts</h3>

      {userPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center space-x-4">
            {userInfo.profilePicture ? (
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
              <p className="text-sm font-medium text-black">{userInfo.username}</p>
              <p className="text-xs text-gray-500">Posted on {new Date(post.postedAt).toLocaleDateString()}</p>
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
    </div>
  );
}
