'use client';

import { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import Image from 'next/image';

// 🎃 Move the interfaces to separate files in order to include them then
interface User {
  id: string;
  username: string;
  profilePicture?: string;
  role?: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search/users?term=${searchTerm}`);
      const data = await response.json();
      setUsers(data.results || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.id === user.id) ? prevSelected.filter((u) => u.id !== user.id) : [...prevSelected, user]
    );
  };

  const removeSelectedUser = (user: User) => {
    setSelectedUsers((prevSelected) => prevSelected.filter((u) => u.id !== user.id));
  };

  async function deleteSelectedUsers() {
    if (selectedUsers.length === 0) return;

    const userIds = selectedUsers.map((user) => user.id);

    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error deleting users: ${errorData.error || 'Unknown error'}`);
        return;
      }

      console.log(res);

      // Remove the deleted users from the current list
      setUsers((prev) => prev.filter((u) => !userIds.includes(u.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  }

  return (
    <div className="p-2 sm:p-4 text-white h-[calc(100vh-120px)] overflow-y-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Manage Users</h1>

      {/* Search Bar */}
      <div className="relative mb-2 sm:mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-1.5 sm:p-2 pl-8 sm:pl-10 border rounded text-black text-xs sm:text-sm"
        />
        <Search className="absolute left-2 sm:left-3 top-2 sm:top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-black" />
      </div>

      {isLoading && <p className="text-gray-300 text-xs sm:text-sm">Loading users...</p>}

      {!isLoading && users.length === 0 && <p className="text-gray-300 text-xs sm:text-sm">No users found.</p>}

      {/* Users List */}
      <div className="max-h-64 sm:max-h-96 overflow-y-auto border border-gray-300 rounded bg-white text-black mb-2 sm:mb-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-1.5 sm:p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleUserSelection(user)}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 mr-2 sm:mr-3">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-500"
                />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-lg bg-gray-300 border-2 border-gray-500">
                  {user.username[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-black text-xs sm:text-sm">{user.username}</span>
            {selectedUsers.some((u) => u.id === user.id) && <Check className="ml-auto h-4 sm:h-5 w-4 sm:w-5 text-green-500" />}
          </div>
        ))}
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="mb-2 sm:mb-4 bg-white p-2 sm:p-4 rounded text-black">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Selected Users</h3>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedUsers.map((user) => (
              <div key={user.id} className="flex items-center p-1 sm:p-2 bg-gray-200 rounded-full text-xs sm:text-sm">
                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gray-300 mr-1 sm:mr-2">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="w-5 h-5 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-500"
                    />
                  ) : (
                    <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-lg bg-gray-300 border-2 border-gray-500">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span>{user.username}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedUser(user);
                  }}
                  className="ml-1 sm:ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Button */}
      <div className="flex justify-start">
        <button
          onClick={deleteSelectedUsers}
          disabled={selectedUsers.length === 0}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm ${
            selectedUsers.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          Delete Selected Users
        </button>
      </div>
    </div>
  );
}
