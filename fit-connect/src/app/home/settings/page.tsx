'use client';

import { useState, useEffect } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';

export default function SettingsScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    biography: '',
    currentPassword: '',
    newPassword: '',
  });

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
        e.returnValue = ''; // This line is necessary for some browsers to show the confirmation dialog
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

  const handleSaveChanges = async () => {
    try {
      // Implement save logic here
      console.log('Saving changes:', formData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      // Handle error (show error message to user)
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement delete account logic here
      console.log('Deleting account');
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
              <User className="w-16 h-16 text-primary rounded-full border-4 border-black text-black" />
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Change avatar</button>
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
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Current email"
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
        <div className="border rounded-lg shadow-lg p-6 bg-white">
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
        </div>

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
