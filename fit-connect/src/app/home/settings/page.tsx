'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, X, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { kgToLb, lbToKg, cmToFeetInches, feetInchesToCm } from '@/utils/conversions';

export default function SettingsScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    profilePicture: '',
    biography: '',
    weight: '',
    height: '',
    currentPassword: '',
    newPassword: '',
  });

  const [isWeightInKg, setIsWeightInKg] = useState(true);
  const [isHeightInCm, setIsHeightInCm] = useState(true);

  const supabase = createClient();

  // Retrieve the user information from the server
  useEffect(() => {
    fetch('/api/user/info')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const { username, profilePicture, biography, weight, height } = data.user;
          setFormData({ ...formData, username, profilePicture, biography, weight, height });
          setImagePreview(profilePicture);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  // Handle browser back/forward buttons and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        (e as any).returnValue = '';
        if (confirm('You have unsaved changes. Do you want to leave without saving?')) {
          setHasUnsavedChanges(false);
          window.history.back();
        } else {
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setHasUnsavedChanges(true);
    }
  }, []);

  const uploadImageToSupabase = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('profile_pictures').upload(fileName, file);
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const publicUrl = supabase.storage.from('profile_pictures').getPublicUrl(fileName);
    if (!publicUrl.data) {
      console.error('Error getting public URL:');
      return null;
    }

    return publicUrl.data.publicUrl;
  };

  const handleSaveChanges = async () => {
    try {
      let imageUrl = formData.profilePicture;
      if (image) {
        imageUrl = await uploadImageToSupabase(image);
        if (!imageUrl) {
          throw new Error('Error uploading image');
        }
      }

      const response = await fetch('/api/user/updateInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, profilePicture: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Error saving changes');
      }

      const data = await response.json();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/user/deleteUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Error deleting account');
        }

        const data = await response.json();
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  // Toggles between weight units (kg <-> lb)
  const toggleWeightUnit = () => {
    setFormData({
      ...formData,
      weight: isWeightInKg ? kgToLb(Number(formData.weight)).toString() : lbToKg(Number(formData.weight)).toString(),
    });
    setIsWeightInKg(!isWeightInKg);
  };

  // Toggles between height units (cm <-> feet and inches)
  const toggleHeightUnit = () => {
    setIsHeightInCm(!isHeightInCm);
    if (isHeightInCm) {
      const heightInCm = Number(formData.height);
      const heightInFeetInches = cmToFeetInches(heightInCm);
      setFormData({ ...formData, height: heightInFeetInches });
    } else {
      const [feetStr, inchesStr] = formData.height.split('ft');
      const feet = Number(feetStr);
      const inches = Number(inchesStr.replace('in', ''));
      const heightInCm = feetInchesToCm(feet, inches);
      setFormData({ ...formData, height: heightInCm });
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Account Settings Card */}
        <div className="border rounded-lg shadow-lg p-3 sm:p-6 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Account Settings</h2>
          <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Profile Picture"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 object-cover"
                  />
                  <button
                    className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
                  </button>
                </div>
              ) : (
                <User className="w-16 h-16 sm:w-20 sm:h-20 text-gray-800 rounded-full border-4 border-gray-800" />
              )}
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer rounded-md bg-blue-100 hover:bg-blue-300 p-1 font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark"
              >
                <span className="text-black text-xs sm:text-sm">Change avatar</span>
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
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-black">
                Username
              </label>
              <input
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Current username"
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="biography" className="block text-xs sm:text-sm font-medium text-black">
                Biography
              </label>
              <input
                id="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Current biography"
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-8">
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="weight" className="block text-xs sm:text-sm font-medium text-black">
                  Weight ({isWeightInKg ? 'kg' : 'lb'})
                </label>
                <input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full sm:w-24 p-1.5 sm:p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                />
                <button
                  type="button"
                  onClick={toggleWeightUnit}
                  className="text-xs sm:text-sm rounded-md p-1 bg-blue-100 hover:bg-blue-300 text-black"
                >
                  Convert to {isWeightInKg ? 'lb' : 'kg'}
                </button>
              </div>

              <div className="space-y-1 sm:space-y-2 mt-3 sm:mt-0">
                <label htmlFor="height" className="block text-xs sm:text-sm font-medium text-black">
                  Height ({isHeightInCm ? 'cm' : 'feet and inches'})
                </label>
                <input
                  id="height"
                  type="text"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full sm:w-24 p-1.5 sm:p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                />
                <button
                  type="button"
                  onClick={toggleHeightUnit}
                  className="text-xs sm:text-sm rounded-md p-1 bg-blue-100 hover:bg-blue-300 text-black"
                >
                  Convert to {isHeightInCm ? 'feet and inches' : 'cm'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="border rounded-lg shadow-lg p-3 sm:p-6 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Security</h2>
          <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="currentPassword" className="block text-xs sm:text-sm font-medium text-black">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Current password"
                  className="w-full p-1.5 sm:p-2 text-xs sm:text-sm text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 p-1.5 sm:p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-black">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New password"
                  className="w-full p-1.5 sm:p-2 text-xs sm:text-sm text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 p-1.5 sm:p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-center">
          <button
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges}
          >
            Save Changes
          </button>
        </div>

        {/* Delete Account */}
        <div className="border rounded-lg shadow-lg p-3 sm:p-6 mt-3 sm:mt-6 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Delete Account</h2>
          <p className="text-xs sm:text-sm text-black mt-2">
            Once you delete this account, there's no going back. Please be certain.
          </p>
          <div className="flex justify-start mt-3 sm:mt-4">
            <button
              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
