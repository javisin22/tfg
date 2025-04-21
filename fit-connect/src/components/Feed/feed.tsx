'use client';

import { Heart, MessageSquareMore, Plus, User as UserIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import Loading from '../Loading';
import { Post } from '../../types';

export default function Feed({ onCreatePost }: { onCreatePost: () => void }) {
  // const [, setUsername] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  // Fetch posts from the API endpoint
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts/info');
        const { posts, likedPosts } = await res.json();
        console.log("Posts:", posts);
        setPosts(posts || []);
        setLikedPosts(likedPosts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    // setUsername(Cookies.get('username') || '');
    fetchPosts();
  }, []);

  // Posting comment request handler
  const postComment = async (postId: string, content: string) => {
    if (!content.trim()) return; // Don't submit empty comments

    try {
      const res = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          content: content,
        }),
      });
      const { comment } = await res.json();
      console.log(comment);

      // Update the posts state to include the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), comment],
              }
            : post
        )
      );

      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error posting comment:', error);
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
          // Update the posts state to increment likes
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes ? post.likes + 1 : 1 } : post))
          );
          // Add postId to likedPosts to prevent multiple likes
          setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
        } else if (data.action === 'disliked') {
          // Update the posts state to decrement likes
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, (post.likes || 0) - 1) } : post))
          );
          // Remove postId from likedPosts
          setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((id) => id !== postId));
        }
      }
    } catch (error) {
      console.error('Error liking/disliking post:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="overflow-y-scroll h-[calc(100vh-120px)] relative">
      {posts.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-xs sm:text-sm md:text-lg">
            You don't have any posts yet and none of your followers either.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg shadow-md p-2 sm:p-4 bg-white">
              <div className="flex items-center mb-2 sm:mb-4">
                {/* Profile picture & username */}
                {post.users.profilePicture ? (
                  <Image
                    src={post.users.profilePicture}
                    alt={`${post.users.username}'s profile picture.`}
                    width={48}
                    height={48}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 rounded-full bg-gray-100 p-1" />
                )}
                <div className="ml-2 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-black">{post.users.username}</p>
                  <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}</p>
                </div>
              </div>
              {/* Post media */}
              <div>
                <div className="flex justify-center">
                  <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
                    <Image
                      src={post?.media}
                      alt="Post"
                      className="rounded-md mb-2 sm:mb-4 w-full h-auto"
                      width="800"
                      height="600"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-700">{post.description}</p>
              </div>
              {/* Post like and comment numbers */}
              <div className="mt-2 sm:mt-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => handleLikePost(post.id)}
                  >
                    <Heart
                      className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 inline-block ${likedPosts.includes(post.id) ? 'text-red-600' : ''}`}
                      fill={likedPosts.includes(post.id) ? 'red' : 'none'}
                    />
                    {post.likes} {post.likes == 1 ? 'Like' : 'Likes'}
                  </button>
                  <span className="text-xs sm:text-sm text-gray-600">
                    <MessageSquareMore className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 inline-block" />
                    {post.comments?.length} {post.comments?.length == 1 ? 'Comment' : 'Comments'}
                  </span>
                </div>
              </div>
              {/* Post comments */}
              {post.comments && post.comments.length > 0 ? (
                <div className="px-2 sm:px-4 py-2 sm:py-4 bg-gray-200 mt-2 sm:mt-4 rounded-md">
                  <h4 className="text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">Comments</h4>
                  <div className="max-h-40 sm:max-h-60 overflow-y-auto">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="flex items-start space-x-1 sm:space-x-2 mb-1.5 sm:mb-2">
                        {comment.users.profilePicture ? (
                          <Image
                            src={comment.users.profilePicture}
                            alt={`${comment.users.username}'s profile picture`}
                            width={32}
                            height={32}
                            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 rounded-full bg-gray-100 p-1" />
                        )}
                        <div className="flex-1 overflow-wrap break-word">
                          <p className="text-xs sm:text-sm font-medium text-black">{comment.users.username}</p>
                          <p className="text-xs sm:text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border rounded-md text-black"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="w-full sm:w-auto bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm mt-1 sm:mt-0"
                      onClick={() => postComment(post.id, newComment)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2 sm:px-4 py-2 sm:py-4 bg-gray-200 mt-2 sm:mt-4 rounded-md">
                  <h4 className="text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">No comments yet</h4>
                  <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border rounded-md text-black"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="w-full sm:w-auto bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm mt-1 sm:mt-0"
                      onClick={() => postComment(post.id, newComment)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white shadow-lg flex items-center justify-center"
        onClick={onCreatePost}
      >
        <Plus size={18} className="sm:hidden" />
        <Plus size={24} className="hidden sm:inline-block" />
      </button>
    </div>
  );
}
