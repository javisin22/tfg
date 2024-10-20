import { useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../types';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const handleSearch = async (term: string) => {
    let endpoint = '';
    if (pathname.startsWith('/home')) {
      endpoint = '/api/search/users';
    } else if (pathname.startsWith('/home/chats')) {
      endpoint = '/api/search/chat-users';
    } else if (pathname.startsWith('/home/events')) {
      endpoint = '/api/search/events';
    } else {
      console.log('Search not implemented for this route');
      return;
    }
    try {
      const response = await fetch(`${endpoint}?term=${term}`);
      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data.users || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
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
    setShowDropdown(false);
  }, [pathname]);

  // Perform search when search term changes
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, debouncedSearch]);

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
                setShowDropdown(false);
              }}
            >
              <Link href={`/home/profile/${result.id}`} className="flex items-center">
                {result.profilePicture ? (
                  <Image
                    src={result.profilePicture}
                    alt={result.username}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 rounded-full mr-2" />
                )}
                <span>{result.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
