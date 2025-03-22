'use client';

import { useState, useCallback } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export function CreatePostScreen({ onClose }: { onClose: () => void }) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For displaying the image preview
  const [description, setDescription] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const supabase = createClient();

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setImage(file); // Set the file for upload
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string); // Display image preview
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleImageUpload(file);
    },
    [handleImageUpload]
  );

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

  const handleNewPost = async () => {
    if (!description || !image) {
      alert('Please provide a description and an image');
      return;
    }

    try {
      const imageUrl = await uploadImageToSupabase(image);
      if (!imageUrl) {
        throw new Error('Error uploading image');
      }

      // Make the API call: /api/posts/new, with the description and media fields
      const res = await fetch('/api/posts/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          media: imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Error creating post');
      }

      const data = await res.json();
      console.log('Post created:', data);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-120px)] p-2 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 mt-3 sm:mt-6">Upload image</h3>

      <div
        className={`relative flex items-center justify-center border-2 border-dashed rounded-lg p-3 sm:p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-100 bg-opacity-30'
        }`}
        style={{ minHeight: '200px', maxHeight: '250px', height: '30vh' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imagePreview ? (
          <div className="absolute inset-0 m-2">
            <Image src={imagePreview} alt="Uploaded" fill style={{ objectFit: 'contain' }} className="rounded-lg" />
            <button
              className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white p-0.5 sm:p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row text-xs sm:text-sm leading-5 sm:leading-6 text-gray-600">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer rounded-md bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 mb-1 sm:mb-0 font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark"
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
              <p className="pl-0 sm:pl-1 text-gray-200">or drag and drop</p>
            </div>
            <p className="text-[10px] sm:text-xs leading-4 sm:leading-5 text-gray-200">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 mt-3 sm:mt-6">Description</h3>
      <textarea
        className="w-full border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm rounded-md mb-3 sm:mb-4 text-black"
        placeholder="What's on your mind?"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end space-x-1 sm:space-x-2">
        <button
          className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleNewPost}
        >
          Post
        </button>
      </div>
    </div>
  );
}
