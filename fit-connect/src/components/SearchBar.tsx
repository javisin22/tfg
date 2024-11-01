import { useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon, Users as GroupIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../types';
import { useChat } from '../contexts/ChatContext';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [specificResults, setSpecificResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { setActiveChat, createChat, chats } = useChat();

  const handleSearch = async (term: string) => {
    let endpoint = '';
    let resultKey = '';

    if (pathname.startsWith('/home/chats')) {
      endpoint = '/api/search/chat-users';
      resultKey = 'chats';
    } else if (pathname.startsWith('/home/events')) {
      endpoint = '/api/search/events';
      resultKey = 'events';
    }
    // else {
    //   console.log('Search not implemented for this route');
    //   return;
    // }
    try {
      let resSearchBar;
      if (pathname.startsWith('/home/chats')) {
        resSearchBar = await fetch(`/api/search/users&groups?term=${term}`);
      } else {
        resSearchBar = await fetch(`/api/search/users?term=${term}`);
      }
      const data = await resSearchBar.json();
      console.log('Search data:', data['results']);

      if (endpoint !== '') {
        // 🎃 Hard-coded for 'Chats' screen
        const resSpecific = await fetch(`${endpoint}?term=${term}`);
        const data = await resSpecific.json();
        console.log('Specific data:', data[resultKey]);
        setSpecificResults(data[resultKey] || []);
      }

      setSearchResults(data['results'] || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
      setSpecificResults([]);
      setShowDropdown(false);
    }
  };

  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounce search function
  const debouncedSearch = useCallback(debounce(handleSearch, 300), [pathname]);

  // Clear search results when navigating to a new page
  useEffect(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSpecificResults([]);
    setShowDropdown(false);
  }, [pathname]);

  // Perform search when search term changes
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]);
      setSpecificResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, debouncedSearch]);

  const handleResultClick = async (result) => {
    if (pathname.startsWith('/home/chats')) {
      // If the logged-in user already has a chat with him, set it as active
      console.log('Result:', result);
      /* Group object example:

      {
        "id": "96293efb-ed86-44e0-ae80-aad827a5ad85",
        "name": "Rhode Island 24/25",
        "avatar": null,
        "isGroup": true,
      }

        Private chat object example:
      {
          "id": "543b5c17-9686-46b4-a4c1-e786055547f5",
          "username": "rbejar",
          "profilePicture": null
      }

      */

      let chat;

      if (result.isGroup) {
        chat = result;
      } else {
        chat = specificResults.find(
          (chat) => !chat.isGroup && chat.otherMembers.some((member) => member.userId === result.id)
        );
      }

      console.log('Chat:', chat);

      // let chat = specificResults.find(
      //   (chat) => !chat.isGroup && chat.otherMembers.some((member) => member.userId === result.id)
      // );

      // Otherwise, create a new chat
      if (!chat) {
        console.log('Creating chat with:', result.id);
        // chat = await createChat(result.id);
        console.log('Chat created:', chat);
      }

      setActiveChat(chat);
    } else {
      // '/home' behavior

      router.push(`/home/profile/${result.id}`);

      //🎃 You can add more cases here if needed
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white p-2 rounded-md">
        <Search className="w-5 h-5 mr-2 text-black" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none text-black w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(searchResults.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        />
      </div>

      {showDropdown && searchResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white text-black rounded-md shadow-lg mt-2 z-10 max-h-64 overflow-y-auto">
          {searchResults.map((result) => (
            <li
              key={result.id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                handleResultClick(result);
              }}
            >
              <div className="flex items-center">
                {result.profilePicture ? (
                  <Image
                    src={result.profilePicture}
                    alt={result.username}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : result.avatar ? (
                  <Image
                    src={result.avatar}
                    alt={result.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : result.isGroup ? (
                  <GroupIcon className="w-6 h-6 rounded-full mr-2" />
                ) : (
                  <UserIcon className="w-6 h-6 rounded-full mr-2" />
                )}
                <span>{result.username || result.name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
