'use client'

import { useState, useEffect } from 'react'
import { X, Search, Check } from 'lucide-react'


export default function CreateGroupPopup({ isOpen, onClose, onCreateGroup }: { 
  isOpen: boolean
  onClose: () => void
  onCreateGroup: (name: string, members: string[]) => void 
}) {
  const [groupName, setGroupName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    if (searchTerm) {
      fetchUsers()
    } else {
      setUsers([])
    }
  }, [searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/search/users?term=${searchTerm}`)
      const data = await response.json()
      if (response.ok) {
        setUsers(data.users)
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const handleCreateGroup = () => {
    if (groupName && selectedUsers.length > 0) {
      onCreateGroup(groupName, selectedUsers)
      onClose()
    }
  }

  if (!isOpen) return null

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
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded text-black"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {users.map(user => (
              <div 
                key={user.id} 
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleUserSelection(user.id)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 text-black">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <span className='text-black'>{user.username}</span>
                {selectedUsers.includes(user.id) && (
                  <Check className="ml-auto h-5 w-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-start p-4 border-t text-black">
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-primary-dark"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
}