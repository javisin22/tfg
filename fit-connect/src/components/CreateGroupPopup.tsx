'use client';

import { useState, useEffect } from 'react';
import { X, Search, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function CreateGroupPopup({
  isOpen,
  onClose,
  onCreateGroup,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, members: string[]) => void;
}) {
  const [eventName, setEventName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<{ id: string; username: string; profilePicture?: string }[]>([]);
  const [errors, setErrors] = useState<{ name?: string; members?: string }>({});

  useEffect(() => {
    // Fetch users from the API based on the search term
    async function fetchUsers() {
      try {
        const response = await fetch(`/api/search/users?term=${searchTerm}`);
        const data = await response.json();
        console.log('Search data:', data.results);
        setUsers(data.results || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    if (searchTerm) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Clear errors when inputs change
    if (eventName && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
    if (selectedUsers.length > 0 && errors.members) {
      setErrors((prev) => ({ ...prev, members: undefined }));
    }
  }, [eventName, selectedUsers, errors]);

  const toggleUserSelection = (user: { id: string; username: string; profilePicture?: string }) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.some((u) => u.id === user.id)
        ? prevSelectedUsers.filter((u) => u.id !== user.id)
        : [...prevSelectedUsers, user]
    );
  };

  const handleCreateGroup = () => {
    const newErrors: { name?: string; members?: string } = {};

    if (!eventName.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (selectedUsers.length === 0) {
      newErrors.members = 'Please select at least one member';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateGroup(
      eventName,
      selectedUsers.map((user) => user.id)
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-black">Create New Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Group Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={`w-full p-2 border rounded text-black ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
            />
            {errors.name && (
              <div className="mt-1 text-red-600 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded text-black"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-black" />
          </div>

          <div className="max-h-60 overflow-y-auto mb-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleUserSelection(user)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 text-black">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full text-lg bg-gray-300 flex items-center justify-center border-2 border-gray-500">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-black">{user.username}</span>
                {selectedUsers.some((u) => u.id === user.id) && <Check className="ml-auto h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>

          {errors.members && (
            <div className="mb-2 text-red-600 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.members}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black mb-2">Selected Users</h3>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center p-2 bg-gray-200 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 text-black">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.username}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-500"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full text-lg bg-gray-300 flex items-center justify-center border-2 border-gray-500">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-black">{user.username}</span>
                    <button onClick={() => toggleUserSelection(user)} className="ml-2 text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-start p-4 border-t text-black">
          <button onClick={handleCreateGroup} className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded">
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
