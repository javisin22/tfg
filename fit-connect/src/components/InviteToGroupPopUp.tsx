'use client';

import { useState } from 'react';

export default function InviteToGroupPopup({
  isOpen,
  onClose,
  onInvite,
  chatId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (chatId: string, selectedUserId: string) => void;
  chatId: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  async function handleSearch() {
    try {
      const res = await fetch(`/api/search/users/?term=${searchTerm}`);
      const data = await res.json();
      console.log(data.results);
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }

  function handleInviteUser(userId: string) {
    onInvite(chatId, userId);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-4 rounded shadow-md w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Invite to Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            X
          </button>
        </div>
        <div className="mb-4">
          <input
            className="border p-2 w-full text-black"
            placeholder="Search username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
            Search
          </button>
        </div>
        <div>
          {searchResults.map((user) => (
            <div key={user.id} className="flex justify-between items-center border-b py-2">
              <span className="text-black">{user.username}</span>
              <button
                onClick={() => handleInviteUser(user.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
              >
                Invite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
