'use client';

import { Heart, MessageSquareMore } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Feed({ onCreatePost }: { onCreatePost: () => void }) {
  const [posts, setPosts] = useState<any[]>([]); // 🎃 Cambiar a tipo 'Post[]' cuando se defina
  const [loading, setLoading] = useState(true);

  // Fetch posts from the API endpoint
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const { posts } = await res.json();
        setPosts(posts);
        console.log(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-y-scroll h-[calc(100vh-120px)] relative">
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg shadow-md p-4 bg-white">
            <div className="flex items-center mb-4">
              <img src={post.avatar} alt={post.user} className="h-10 w-10 rounded-full" />
              <div className="ml-4">
                <p className="text-sm font-medium text-primary">{post.user}</p>
              </div>
            </div>
            <div>
              <img src={post.image} alt="Post" className="rounded-md mb-4" />
              <p className="text-sm text-gray-700">{post.content}</p>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800">
                  <Heart className="mr-2 h-4 w-4 inline-block" />
                  {post.likes} Likes
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  <MessageSquareMore className="mr-2 h-4 w-4 inline-block" />
                  {/* {post.comments.length} */}
                  Comments
                </button>
              </div>
            </div>
            {post.comments && post.comments.length > 0 ? (
              <div className="px-6 py-4 bg-gray-200 mt-4">
                <h4 className="text-sm font-medium text-black mb-2">Comments</h4>
                {post.comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{comment['user-id']}</span>{' '}
                      {/*🎃 Poner el username en lugar del user-id*/}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{comment.user}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex items-center space-x-2">
                  <input type="text" placeholder="Add a comment..." className="flex-1 px-3 py-2 border rounded-md" />
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Post</button>
                </div>
              </div>
            ) : (
              <div>No comments yet</div>
            )}
          </div>
        ))}
      </div>
      <button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-500 text-white shadow-lg"
        onClick={onCreatePost}
      >
        <svg
          className="h-6 w-6 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
