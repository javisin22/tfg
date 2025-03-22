'use client';

import { useState, useEffect } from 'react';
import { User, Heart, MessageSquareMore } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Post } from '../../../../types';
import Loading from '../../../../components/Loading';

export default function UserProfile() {
  const router = useRouter();
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return; // Ensure userId is available

    async function fetchLoggedInUserInfo() {
      try {
        const res = await fetch('/api/user/info');
        const { user } = await res.json();
        console.log('User Info:', user);
        if (user.id == id) {
          router.push('/home/profile');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    async function fetchUserInfo() {
      try {
        const res = await fetch(`/api/user/${id}/info`);
        const { user } = await res.json();
        console.log('User Info:', user);
        setUserInfo(user);
        setIsFollowing(user.isFollowing);
        setFollowersCount(user.followersCount);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    async function fetchUserPosts() {
      try {
        const res = await fetch(`/api/user/${id}/posts`);
        const { posts } = await res.json();
        console.log('User Posts:', posts);
        // Initialize likedPosts state based on the flag in each post
        const likedPosts = posts.filter((post: any) => post.likedByUser).map((post: any) => post.id);
        setLikedPosts(likedPosts);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }

    fetchLoggedInUserInfo();
    fetchUserInfo();
    fetchUserPosts();
  }, [id]);

  const toggleFollow = async () => {
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const res = await fetch(`/api/user/${id}/${action}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setFollowersCount((prevCount) => (isFollowing ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
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
          setUserPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes ? +1 : 1 } : post))
          );
          setLikedPosts((prev) => [...prev, postId]);
        } else if (data.action === 'disliked') {
          setUserPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, (post.likes || 0) - 1) } : post))
          );
          setLikedPosts((prev) => prev.filter((id) => id !== postId));
        }
      }
    } catch (error) {
      console.error('Error liking/disliking post:', error);
    }
  };

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
              className="h-24 w-24 rounded-full text-gray-700 object-cover"
            />
          ) : (
            <User className="h-24 w-24 rounded-full text-gray-700" />
          )}
          <h2 className="text-2xl text-gray-500 font-bold text-primary">{userInfo.username}</h2>
          <p className="text-sm text-gray-500">{userInfo.biography}</p>
          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isFollowing ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-800'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{userPosts.length}</p>
              <p className="text-sm text-gray-500">{userPosts.length === 1 ? 'Post' : 'Posts'}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{followersCount}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-primary text-gray-400">{userInfo.followingCount || 0}</p>
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
                className="h-10 w-10 rounded-full object-cover"
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
              <MessageSquareMore className="mr-1 h-4 w-4 inline-block" />
              {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
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
                    width={32}
                    height={32}
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
    </div>
  );
}
