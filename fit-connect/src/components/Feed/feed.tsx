'use client';

import {
  Heart,
  MessageSquareMore,
} from 'lucide-react';

export default function Feed({ onCreatePost }: { onCreatePost: () => void }) {
  const posts = [
    {
      id: 1,
      user: 'Jane Doe',
      avatar: '/placeholder.svg?height=40&width=40',
      image: '/placeholder.svg?height=300&width=400',
      content: 'Just finished an amazing HIIT workout! 💪 #FitnessGoals',
      likes: 24,
      comments: [
        { user: 'John', content: 'Great job! Keep it up! 🔥' },
        { user: 'Sarah', content: "You're inspiring me to workout too!" },
      ],
    },
    {
      id: 2,
      user: 'Mike Smith',
      avatar: '/placeholder.svg?height=40&width=40',
      image: '/placeholder.svg?height=300&width=400',
      content: 'New personal best on my 5k run! 🏃‍♂️ #Running',
      likes: 18,
      comments: [
        { user: 'Emily', content: "Wow, that's impressive!" },
        { user: 'David', content: "What's your secret? Share some tips!" },
      ],
    },
  ];

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
                  {post.comments.length} Comments
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-200 mt-4">
              <h4 className="text-sm font-medium text-black mb-2">Comments</h4>
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{comment.user[0]}</span>
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
