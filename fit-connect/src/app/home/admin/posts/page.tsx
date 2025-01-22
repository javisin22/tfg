'use client';

import { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import Image from 'next/image';

// 🎃 Move the interfaces to separate files in order to include them then
interface Post {
  id: string;
  description: string;
  media?: string;
  postedAt?: string;
  userId: string;
  users?: {
    username: string;
  };
}

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchPosts();
    } else {
      setPosts([]); // Clear posts if search is empty
    }
  }, [searchTerm]);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search/posts?term=${searchTerm}`);
      const data = await response.json();
      setPosts(data.results || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const togglePostSelection = (post: Post) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.some((p) => p.id === post.id) ? prevSelected.filter((p) => p.id !== post.id) : [...prevSelected, post]
    );
  };

  const removeSelectedPost = (post: Post) => {
    setSelectedPosts((prevSelected) => prevSelected.filter((p) => p.id !== post.id));
  };

  async function deleteSelectedPosts() {
    if (selectedPosts.length === 0) return;

    const postIds = selectedPosts.map((post) => post.id);

    try {
      const res = await fetch('/api/admin/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIds }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error deleting posts: ${errorData.error || 'Unknown error'}`);
        return;
      }

      // Remove the deleted posts from the current list
      setPosts((prev) => prev.filter((p) => !postIds.includes(p.id)));
      setSelectedPosts([]);
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Manage Posts</h1>

      {/* Search Bar */}
      <div className="relative mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded text-black"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-black" />
      </div>

      {isLoading && <p className="text-gray-300">Loading posts...</p>}

      {!isLoading && posts.length === 0 && <p className="text-gray-300">No posts found.</p>}

      {/* Posts List */}
      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded bg-white text-black mb-4">
        {posts.map((post) => {
          const isSelected = selectedPosts.some((p) => p.id === post.id);
          return (
            <div
              key={post.id}
              className="flex gap-4 p-4 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => togglePostSelection(post)}
            >
              {/* Media Preview */}
              <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {post.media ? (
                  <Image src={post.media} alt="Post media" width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">No image</div>
                )}
              </div>

              {/* Description & Info */}
              <div className="flex-1">
                <div className="text-sm text-black break-words line-clamp-2">
                  {post.description || '[No description provided]'}
                </div>
                <p className="text-xs text-gray-600 mt-1">Author: {post.users?.username || 'Unknown'}</p>
                {post.postedAt && (
                  <p className="text-xs text-gray-600">
                    Posted at: {new Date(post.postedAt).toLocaleDateString()} {new Date(post.postedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Selection Check icon */}
              {isSelected && (
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Posts */}
      {selectedPosts.length > 0 && (
        <div className="mb-4 bg-white p-4 rounded text-black">
          <h3 className="text-lg font-semibold mb-2">Selected Posts</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPosts.map((post) => (
              <div key={post.id} className="flex items-center p-2 bg-gray-200 rounded-full">
                <span className="truncate max-w-[200px] mr-1">{post.description || '[Untitled]'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedPost(post);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Button */}
      <div className="flex justify-start">
        <button
          onClick={deleteSelectedPosts}
          disabled={selectedPosts.length === 0}
          className={`px-4 py-2 rounded ${
            selectedPosts.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          Delete Selected Posts
        </button>
      </div>
    </div>
  );
}
