'use client';

import { useState } from 'react';

export default function SettingsScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-6 p-6">
        {/* <!-- Account Settings Card --> */}
        <div className="border rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary">Account Settings</h2>
          <div className="space-y-4 mt-4">
            {/* <!-- Username Section --> */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="flex space-x-2">
                <input
                  id="username"
                  placeholder="Current username"
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Change</button>
              </div>
            </div>

            {/* <!-- Email Section --> */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex space-x-2">
                <input
                  id="email"
                  type="email"
                  placeholder="Current email"
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Change</button>
              </div>
            </div>

            {/* <!-- Password Section --> */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    id="password"
                    type="password"
                    placeholder="New password"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Change</button>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Notifications Card --> */}
        <div className="border rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary">Notifications</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">
                  Enable Notifications
                </label>
                <p className="text-sm text-gray-500">Receive notifications about your activity</p>
              </div>
              <input
                type="checkbox"
                id="notifications"
                className="h-5 w-5 rounded-full border-gray-300 text-primary focus:ring-primary"
                checked
              />
            </div>
          </div>
        </div>

        {/* <!-- Privacy Card --> */}
        <div className="border rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary">Privacy</h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="private-profile" className="block text-sm font-medium text-gray-700">
                  Private Profile
                </label>
                <p className="text-sm text-gray-500">Only approved followers can see your posts</p>
              </div>
              <input
                type="checkbox"
                id="private-profile"
                className="h-5 w-5 rounded-full border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
