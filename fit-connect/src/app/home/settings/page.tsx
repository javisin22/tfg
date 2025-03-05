'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, X, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { kgToLb, lbToKg, cmToFeetInches, feetInchesToCm } from '@/utils/conversions';

export default function SettingsScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // const [notifications, setNotifications] = useState(true);
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
    // Fetch user data from the server
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
        // Handle error (show error message to user)
      });
  }, []);

  // Handle browser back/forward buttons and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // This line is necessary for some browsers to show the confirmation dialog
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        (e as any).returnValue = ''; // This line is necessary for some browsers to show the confirmation dialog
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

    console.log('Image uploaded has the publicUrl:', publicUrl.data.publicUrl);
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
      console.log('Changes saved:', data);

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
        console.log('Account deleted:', data);

        // Redirect the user to the login page ('/login')
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
      weight: isWeightInKg
        ? kgToLb(Number(formData.weight)).toString() // convert kg to lb
        : lbToKg(Number(formData.weight)).toString(), // convert lb to kg
    });
    setIsWeightInKg(!isWeightInKg);
  };

  // Toggles between height units (cm <-> feet and inches)
  const toggleHeightUnit = () => {
    setIsHeightInCm(!isHeightInCm);
    if (isHeightInCm) {
      // Convert cm to feet and inches
      const heightInCm = Number(formData.height);
      const heightInFeetInches = cmToFeetInches(heightInCm);
      setFormData({ ...formData, height: heightInFeetInches });
    } else {
      // Convert feet and inches back to cm
      const [feetStr, inchesStr] = formData.height.split('ft');
      const feet = Number(feetStr);
      const inches = Number(inchesStr.replace('in', ''));
      const heightInCm = feetInchesToCm(feet, inches);
      setFormData({ ...formData, height: heightInCm });
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-6 p-6">
        {/* Account Settings Card */}
        <div className="border rounded-lg shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Account Settings</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Profile Picture"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-gray-800 object-cover"
                  />
                  <button
                    className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <X className="h-4 w-4 text-black" />
                  </button>
                </div>
              ) : (
                <User className="w-20 h-20 text-gray-800 rounded-full border-4 border-gray-800" />
              )}
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer rounded-md bg-blue-100 hover:bg-blue-300 p-1 font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark"
              >
                <span className="text-black">Change avatar</span>
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

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-black">
                Username
              </label>
              <input
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Current username"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="biography" className="block text-sm font-medium text-black">
                Biography
              </label>
              <input
                id="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Current biography"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            <div className="flex justify-start gap-8 w-40">
              <div className="space-y-2">
                <label htmlFor="weight" className="block text-sm font-medium text-black">
                  Weight ({isWeightInKg ? 'kg' : 'lb'})
                </label>
                <input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                />
                <button
                  type="button"
                  onClick={toggleWeightUnit}
                  className="text-sm rounded-md p-1 bg-blue-100 hover:bg-blue-300 text-black"
                >
                  Convert to {isWeightInKg ? 'lb' : 'kg'}
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="height" className="block text-sm font-medium text-black">
                  Height ({isHeightInCm ? 'cm' : 'feet and inches'})
                </label>
                <input
                  id="height"
                  type="text"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                />
                <button
                  type="button"
                  onClick={toggleHeightUnit}
                  className="text-sm rounded-md p-1 bg-blue-100 hover:bg-blue-300 text-black"
                >
                  Convert to {isHeightInCm ? 'feet and inches' : 'cm'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="border rounded-lg shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Security</h2>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-black">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Current password"
                  className="w-full p-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New password"
                  className="w-full p-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        {/* <div className="border rounded-lg shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Notifications</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="notifications" className="block text-sm font-medium text-black">
                  Enable Notifications
                </label>
                <p className="text-sm text-gray-700">Receive notifications about your activity</p>
              </div>
              <input
                type="checkbox"
                id="notifications"
                className="h-5 w-5 rounded-full border-gray-300 text-primary focus:ring-primary"
                checked={notifications}
                onChange={() => {
                  setNotifications(!notifications);
                  setHasUnsavedChanges(true);
                }}
              />
            </div>
          </div>
        </div> */}

        {/* Save Changes Button */}
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges}
          >
            Save Changes
          </button>
        </div>

        {/* Delete Account */}
        <div className="border rounded-lg shadow-lg p-6 mt-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Delete Account</h2>
          <p className="text-sm text-black mt-2">Once you delete this account, there's no going back. Please be certain.</p>
          <div className="flex justify-start mt-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
