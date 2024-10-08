'use client';
import { Image } from 'lucide-react';
import { useState } from 'react';
import Feed from '../../components/Feed/Feed';

function CreatePostScreen({ onClose }: { onClose: () => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2 mt-6">Upload image</h3>

      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-100 bg-opacity-30">
        {/* {image ? (
          <div className="relative">
            <img src={image} alt="Uploaded" className="max-h-64 rounded-lg" />
            <Button variant="secondary" size="icon" className="absolute top-2 right-2" onClick={() => setImage(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : 
        (*/}
        <div className="text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark"
            >
              <span>Upload a file</span>
              <input
                id="image-upload"
                name="image-upload"
                type="file"
                className="sr-only"
                onChange={handleImageUpload}
              />
            </label>
            <p className="pl-1 text-gray-200">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-200">PNG, JPG, GIF up to 10MB</p>
        </div>
        {/* ) */}
      </div>

      
      <h3 className="text-lg font-semibold mb-2 mt-6">Description</h3>
      <textarea className="w-full border border-gray-300 p-2 rounded-md mb-4 text-black" placeholder="What's on your mind?" />
      <div className="flex justify-end space-x-2">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded" onClick={onClose}>
          Cancel
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Post</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);

  const handleCreatePost = () => {
    setIsCreatingPost(true);
    setActiveTab('create-post');
  };

  const handleCloseCreatePost = () => {
    setIsCreatingPost(false);
    setActiveTab('Home');
  };

  return (
    <div className="h-screen">
      {activeTab === 'Home' && <Feed onCreatePost={handleCreatePost} />}
      {activeTab === 'create-post' && <CreatePostScreen onClose={handleCloseCreatePost} />}
    </div>
  );
}
