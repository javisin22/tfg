'use client';

import { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import Image from 'next/image';

// 🎃 Move the interfaces to separate files in order to include them then
interface Comment {
  id: string;
  userId: string;
  postId: string;
  postedAt?: string;
  content: string;
  users?: {
    username: string;
  };
}

interface Post {
  id: string;
  description: string;
  media?: string;
  postedAt?: string;
  userId: string;
  users?: {
    username: string;
  };
  comments: Comment[];
}

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [selectedComments, setSelectedComments] = useState<Comment[]>([]);
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

  const toggleCommentSelection = (comment: Comment) => {
    setSelectedComments((prevSelected) =>
      prevSelected.some((c) => c.id === comment.id) ? prevSelected.filter((c) => c.id !== comment.id) : [...prevSelected, comment]
    );
  };

  const removeSelectedComment = (comment: Comment) => {
    setSelectedComments((prevSelected) => prevSelected.filter((c) => c.id !== comment.id));
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

  async function deleteSelectedComments() {
    if (selectedComments.length === 0) return;

    // Extract the IDs of the selected comments
    const commentIds = selectedComments.map((comment) => comment.id);

    try {
      const res = await fetch('/api/admin/comments/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentIds }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error deleting comments: ${errorData.error || 'Unknown error'}`);
        return;
      }

      // Remove the deleted comments from the current list
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          comments: post.comments.filter((c) => !commentIds.includes(c.id)),
        }))
      );

      // Clear the selected comments
      setSelectedComments([]);
    } catch (error) {
      console.error('Error deleting comments:', error);
    }
  }

  return (
    <div className="p-2 sm:p-4 text-white h-[calc(100vh-120px)] overflow-y-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Manage Posts</h1>

      {/* Search Bar */}
      <div className="relative mb-2 sm:mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-1.5 sm:p-2 pl-8 sm:pl-10 border rounded text-black text-xs sm:text-sm"
        />
        <Search className="absolute left-2 sm:left-3 top-2 sm:top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-black" />
      </div>

      {isLoading && <p className="text-gray-300 text-xs sm:text-sm">Loading posts...</p>}
      {!isLoading && posts.length === 0 && <p className="text-gray-300 text-xs sm:text-sm">No posts found.</p>}

      {/* Posts List */}
      <div className="max-h-64 sm:max-h-96 overflow-y-auto border border-gray-300 rounded bg-white text-black mb-2 sm:mb-4">
        {posts.map((post) => {
          const isSelected = selectedPosts.some((p) => p.id === post.id);
          return (
            <div key={post.id} className="p-2 sm:p-4 border-b last:border-b-0 hover:bg-gray-50">
              {/* Post row */}
              <div className="flex gap-2 sm:gap-4 cursor-pointer" onClick={() => togglePostSelection(post)}>
                {/* Media Preview */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {post.media ? (
                    <Image src={post.media} alt="Post media" width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 text-xs sm:text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* Description & Info */}
                <div className="flex-1">
                  <div className="text-xs sm:text-sm text-black break-words line-clamp-2">
                    {post.description || '[No description provided]'}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">
                    <u>Author:</u> {post.users?.username || 'Unknown'}
                  </p>
                  {post.postedAt && (
                    <p className="text-xs text-gray-600">
                      <u>Posted at:</u> {new Date(post.postedAt).toLocaleDateString()}{' '}
                      {new Date(post.postedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Selection Check icon */}
                {isSelected && (
                  <div className="flex items-center">
                    <Check className="h-4 sm:h-5 w-4 sm:w-5 text-green-500" />
                  </div>
                )}
              </div>

              {/* Post comments (if any) */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-1 sm:mt-2 ml-6 sm:ml-12 border-l border-gray-200 pl-2 sm:pl-4">
                  <p className="text-xs sm:text-sm font-bold text-gray-500 mb-0.5 sm:mb-1">Comments:</p>
                  {post.comments.map((comment, idx) => {
                    const commentSelected = selectedComments.some((c) => c.id === comment.id);
                    return (
                      <div
                        key={comment.id}
                        className={`flex justify-between items-center text-xs sm:text-sm mb-1 sm:mb-2 cursor-pointer ${idx !== 0 ? 'mt-2 sm:mt-4' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Stop the onClick from also toggling the entire post
                          toggleCommentSelection(comment);
                        }}
                      >
                        <div>
                          <p className="text-black break-words">{comment.content}</p>
                          <p className="text-xs text-gray-600">
                            By: <span className="italic font-bold">{comment.users?.username || 'Unknown'}</span> on{' '}
                            {comment.postedAt ? new Date(comment.postedAt).toLocaleString() : ''}
                          </p>
                        </div>
                        {/* Checkmark if selected */}
                        {commentSelected && <Check className="h-3 sm:h-4 w-3 sm:w-4 text-blue-500" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Posts */}
      {selectedPosts.length > 0 && (
        <div className="mb-2 sm:mb-4 bg-white p-2 sm:p-4 rounded text-black">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Selected Posts</h3>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedPosts.map((post) => (
              <div key={post.id} className="flex items-center p-1 sm:p-2 bg-gray-200 rounded-full text-xs sm:text-sm">
                <span className="truncate max-w-[120px] sm:max-w-[200px] mr-1">{post.description || '[Untitled]'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedPost(post);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 sm:h-4 w-3 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Comments */}
      {selectedComments.length > 0 && (
        <div className="mb-2 sm:mb-4 bg-white p-2 sm:p-4 rounded text-black">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Selected Comments</h3>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedComments.map((comment) => (
              <div key={comment.id} className="flex items-center p-1 sm:p-2 bg-gray-200 rounded-full text-xs sm:text-sm">
                <span className="truncate max-w-[120px] sm:max-w-[200px] mr-1">{comment.content || '[No text]'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedComment(comment);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 sm:h-4 w-3 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          onClick={deleteSelectedPosts}
          disabled={selectedPosts.length === 0}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm ${
            selectedPosts.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          Delete Selected Posts
        </button>

        <button
          onClick={deleteSelectedComments}
          disabled={selectedComments.length === 0}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm ${
            selectedComments.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          Delete Selected Comments
        </button>
      </div>
    </div>
  );
}
