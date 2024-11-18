'use client';

import { Heart, MessageSquareMore, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import Loading from '../Loading';
import { Post, Comment } from '../../types';

export default function Feed({ onCreatePost }: { onCreatePost: () => void }) {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState<Post[]>([]); // 🎃 Fixear errores de tipo 'Post'
  const [newComment, setNewComment] = useState<Comment>();
  const [loading, setLoading] = useState(true);

  // Fetch posts from the API endpoint
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts/info');
        const { posts } = await res.json();
        console.log(posts);
        setPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    setUsername(Cookies.get('username') || '');
    fetchPosts();
  }, []);

  // Posting comment request handler´
  const postComment = async (postId: string, userId: string, content: string) => {
    try {
      const res = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          userId: userId,
          content: content,
        }),
      });
      const data = await res.json();
      console.log(data);

      // Update the posts state to include the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, { userId, content, users: { username: username } }],
              }
            : post
        )
      );

      setNewComment({ id: '', postId: '', userId: '', content: '' }); // Clear the input field
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="overflow-y-scroll h-[calc(100vh-120px)] relative">
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg shadow-md p-4 bg-white">
            <div className="flex items-center mb-4">
              {/* Profile picture & username */}
              <Image
                src={post.users.profilePicture}
                alt={`${post.users.username}'s profile picture.`}
                width="40"
                height="40"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-black">{post.users.username}</p>
              </div>
            </div>
            {/* Post media */}
            <div>
              <Image src={post?.media} alt="Post" className="rounded-md mb-4" width="200" height="200" />
              <p className="text-sm text-gray-700">{post.description}</p>
            </div>
            {/* Post like and comment numbers */}
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800">
                  <Heart className="mr-2 h-4 w-4 inline-block" />
                  {post.likes} Likes
                  {/* 🎃 Likes aún no están implementados */}
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  <MessageSquareMore className="mr-2 h-4 w-4 inline-block" />
                  {post.comments.length} {post.comments.length > 1 ? 'Comments' : 'Comment'}
                </button>
              </div>
            </div>
            {/* Post comments */}
            {post.comments && post.comments.length > 0 ? (
              <div className="px-6 py-4 bg-gray-200 mt-4">
                <h4 className="text-sm font-medium text-black mb-2">Comments</h4>
                {post.comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{comment.users.username.charAt(0).toUpperCase()}</span>{' '}
                      {/*🎃 Poner la foto de perfil del usuario en lugar de su inicial?*/}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{comment.users.username}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md text-black"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => postComment(post.id, post.userId, newComment)}
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 bg-gray-200 mt-4">
                <h4 className="text-sm font-medium text-black mb-2">No comments yet</h4>
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md text-black"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => postComment(post.id, post.userId, newComment)}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-500 text-white shadow-lg" onClick={onCreatePost}>
        <Plus size={24} className="inline-block" />
      </button>
    </div>
  );
}
