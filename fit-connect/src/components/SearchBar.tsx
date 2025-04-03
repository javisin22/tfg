import { useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon, Users as GroupIcon, Calendar, AlertCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../types';
import { useChat } from '../contexts/ChatContext';
import { useEvents } from '../contexts/EventsContext';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [specificResults, setSpecificResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { setActiveChat, createChat, chats } = useChat();
  const { handleEventSelected } = useEvents();

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;

    setIsSearching(true);
    let endpoint = '';
    let resultKey = '';

    if (pathname.startsWith('/home/chats')) {
      endpoint = '/api/search/chat-users';
      resultKey = 'chats';
    } else if (pathname.startsWith('/home/events')) {
      endpoint = '/api/search/events';
      resultKey = 'events';
    }

    try {
      let resSearchBar;
      if (pathname.startsWith('/home/chats')) {
        resSearchBar = await fetch(`/api/search/users&groups?term=${term}`);
      } else if (pathname.startsWith('/home/events')) {
        resSearchBar = await fetch(`/api/search/events?term=${term}`);
      } else {
        resSearchBar = await fetch(`/api/search/users?term=${term}`);
      }
      const data = await resSearchBar.json();
      console.log('Search data:', data['results']);

      if (endpoint !== '') {
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
    } finally {
      setIsSearching(false);
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
      let chat;

      if (result.isGroup) {
        chat = result;
      } else {
        chat = specificResults.find((chat) => !chat.isGroup && chat.otherMembers.some((member) => member.userId === result.id));
      }

      // Otherwise, create a new chat (only for private chats)
      if (!chat) {
        console.log('Creating chat with:', result.id);
        chat = await createChat(result.id);
        // console.log('Chat created:', chat);
      }

      setActiveChat(chat);
    } else if (pathname.startsWith('/home/events')) {
      handleEventSelected(result);
    } else {
      // add else ifs for 'events' page and leave the else for the '/home' behavior
      // '/home' behavior
      router.push(`/home/profile/${result.id}`);
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
          onFocus={() => setShowDropdown(searchTerm.trim().length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white text-black rounded-md shadow-lg mt-2 z-10 max-h-64 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <span className="text-sm">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
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
                        className="w-6 h-6 rounded-full mr-2 object-cover flex-shrink-0"
                      />
                    ) : result.avatar ? (
                      <Image
                        src={result.avatar}
                        alt={result.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full mr-2 object-cover flex-shrink-0"
                      />
                    ) : result.isGroup ? (
                      <GroupIcon className="w-6 h-6 rounded-full mr-2 flex-shrink-0" />
                    ) : result.date ? (
                      <Calendar className="w-6 h-6 rounded-full mr-2 flex-shrink-0" />
                    ) : (
                      <UserIcon className="w-6 h-6 rounded-full mr-2 flex-shrink-0" />
                    )}
                    <span className="truncate overflow-hidden block">{result.username || result.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle className="w-5 h-5 text-orange-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  {pathname.startsWith('/home/chats')
                    ? 'No chats or users found matching your search'
                    : pathname.startsWith('/home/events')
                      ? 'No events found matching your search'
                      : 'No results found'}
                </span>
                {pathname.startsWith('/home/chats') && (
                  <p className="text-xs text-gray-500 mt-1">Try searching for another username or create a new chat</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
