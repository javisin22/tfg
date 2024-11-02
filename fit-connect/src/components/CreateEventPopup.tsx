'use client';

import { useState, useCallback, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export default function CreateEventPopup({
  isOpen,
  onClose,
  onCreateEvent,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: {
    name: string;
    date: string;
    location: string;
    maxParticipants: number | null;
    description: string;
    media: string;
  }) => void;
}) {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number | null>(null);
  const [eventDescription, setEventDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const supabase = createClient();

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
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
    const { data, error } = await supabase.storage.from('events_media').upload(fileName, file);
    if (error) {
      console.error('Error uploading image:', error);
    }

    const publicUrl = supabase.storage.from('events_media').getPublicUrl(fileName);
    console.log('Image uploaded has the publicUrl:', publicUrl.data?.publicUrl);
    return publicUrl.data?.publicUrl;
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventDate || !eventLocation || !eventDescription || !image) {
      alert('Please provide all required fields and upload an image');
      return;
    }

    try {
      const imageUrl = await uploadImageToSupabase(image);
      if (!imageUrl) {
        throw new Error('Error uploading image');
      }

      onCreateEvent({
        name: eventName,
        date: eventDate,
        location: eventLocation,
        maxParticipants,
        description: eventDescription,
        media: imageUrl,
      });
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-black">Create New Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <input
            type="date"
            placeholder="Event Date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <input
            type="text"
            placeholder="Event Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <input
            type="number"
            placeholder="Max Participants"
            value={maxParticipants !== null ? maxParticipants : ''}
            onChange={(e) => setMaxParticipants(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full p-2 border rounded mb-4 text-black"
          />
          {/*🎃 FIX: puede llegar a desbordar (haría falta poner una barra lateral para subir/bajar) */}
          <textarea
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <div
            className={`relative flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-500 bg-gray-400 bg-opacity-50'
            }`}
            style={{ minHeight: '200px' }}
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
                <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
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
                  <p className="pl-1 text-black">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-black">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start p-4 border-t text-black">
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-primary-dark"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
