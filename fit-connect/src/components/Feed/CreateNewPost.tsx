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
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2 mt-6">Upload image</h3>

      <div
        className={`relative flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-100 bg-opacity-30'
        }`}
        style={{ minHeight: '300px' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imagePreview ? (
          <div className="absolute inset-0 m-2">
            <Image
              src={imagePreview}
              alt="Uploaded"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
            >
              <X className="h-4 w-4 text-black" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
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
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) handleImageUpload(file);
                  }}
                  accept="image/*"
                />
              </label>
              <p className="pl-1 text-gray-200">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-200">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-6">Description</h3>
      <textarea
        className="w-full border border-gray-300 p-2 rounded-md mb-4 text-black"
        placeholder="What's on your mind?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleNewPost}
        >
          Post
        </button>
      </div>
    </div>
  );
}
