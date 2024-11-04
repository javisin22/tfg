'use client';

import { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';

export default function SettingsScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-6 p-6">
        {/* <!-- Account Settings Card --> */}
        <div className="border rounded-lg shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Account Settings</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-4">
              {/* Avatar Section */}
              <User className="w-16 h-16 text-primary rounded-full border-4 border-black text-black" />
              {/* Change Avatar Button */}
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Change avatar</button>
            </div>

            {/* <!-- Username Section --> */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-black">
                Username
              </label>
              <input
                id="username"
                placeholder="Current username"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            {/* <!-- Email Section --> */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Current email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            {/* Biography Section */}
            <div className="space-y-2">
              <label htmlFor="biography" className="block text-sm font-medium text-black">
                Biography
              </label>
              <input
                id="biography"
                placeholder="Current biography"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              />
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-start pt-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="border rounded-lg shadow-lg p-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Security</h2>
          <div className="space-y-4 mt-4">
            {/* Current Password Section */}
            <div className="space-y-2">
              <label htmlFor="current-password" className="block text-sm font-medium text-black">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
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

            {/* New Password Section */}
            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-medium text-black">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
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

            {/* Change Password Button */}
            <div className="flex justify-start pt-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Change Password</button>
            </div>
          </div>
        </div>

        {/* <!-- Notifications Card --> */}
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
                onChange={() => setNotifications(!notifications)}
              />
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="border rounded-lg shadow-lg p-6 mt-6 bg-white">
          <h2 className="text-2xl font-bold text-black">Delete Account</h2>
          <p className="text-sm text-black mt-2">Once you delete this account, there's no going back. Please be certain.</p>
          <div className="flex justify-start mt-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
