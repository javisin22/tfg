import { useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../types';
import { useChat } from '../contexts/ChatContext';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [specificResults, setSpecificResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const { setActiveChat, createChat, chats } = useChat();

  /* Chats object example:
  [
    {
        "id": "96293efb-ed86-44e0-ae80-aad827a5ad85",
        "name": "Rhode Island 24/25",
        "isGroup": true,
        "avatar": null,
        "lastMessage": [
            {
                "id": "bc560262-8e4a-4258-9245-91a3fd767092",
                "content": "qué hago en este grupo??",
                "timeStamp": "2024-10-29T22:23:24.729086"
            },
            {
                "id": "48863a4f-81f5-4d25-a41e-e7f82373b590",
                "content": "Bieen, bien, por aquí todo bien",
                "timeStamp": "2024-10-29T22:23:04.245986"
            },
            {
                "id": "68b5f869-9975-4662-ae66-c88857510852",
                "content": "Hola grupo, cómo va el día",
                "timeStamp": "2024-10-29T22:22:37.871655"
            }
        ],
        "chat_members": [
            {
                "id": "08acc9af-3613-435f-9bbb-363f43520fe0",
                "chatId": "96293efb-ed86-44e0-ae80-aad827a5ad85",
                "userId": "468bb20a-da08-440d-8978-8418e2c17aa6",
                "joinedAt": "2024-10-29T22:20:00.047228"
            }
        ]
    },
    {
        "id": "0ceec5b8-635b-4f75-826e-b7574424ea1c",
        "name": "roldo",
        "isGroup": false,
        "avatar": null,
        "lastMessage": [
            {
                "id": "3fa0b199-4b79-4ba6-993a-12f1c3166c08",
                "content": "Por fin funciona diego 😭",
                "timeStamp": "2024-10-30T13:46:42.279391"
            },
            {
                "id": "949aa55b-3810-4270-8539-3e521865ef6b",
                "content": "Eres el mejor!!",
                "timeStamp": "2024-10-30T13:46:26.726546"
            },
            {
                "id": "36096db7-57bb-4487-b529-6584937f1e5b",
                "content": "Todo bien tío, avanzando el tfg a ratos.",
                "timeStamp": "2024-10-29T22:21:27.843572"
            },
            {
                "id": "a45bd413-1900-42a9-a674-675520cdaf4d",
                "content": "Hola Javi, qué tal por allí?",
                "timeStamp": "2024-10-29T22:20:53.60729"
            }
        ],
        "chat_members": [
            {
                "id": "9552720a-7f4f-4644-b6cb-072940c21a2e",
                "chatId": "0ceec5b8-635b-4f75-826e-b7574424ea1c",
                "userId": "468bb20a-da08-440d-8978-8418e2c17aa6",
                "joinedAt": "2024-10-30T01:50:01.49156"
            }
        ]
    },
    {
        "id": "274cf263-07e3-402a-a3b6-76898cf38342",
        "name": "rbejar",
        "isGroup": false,
        "avatar": null,
        "lastMessage": [
            {
                "id": "91d67520-0d4f-4c25-9d7c-91762d27b5ab",
                "content": "Funciona?",
                "timeStamp": "2024-10-30T13:42:22.382749"
            },
            {
                "id": "da93f681-8f3b-4fa9-bd6d-0b426d2d6e7e",
                "content": "Lo se, lo siento",
                "timeStamp": "2024-10-30T13:41:01.512847"
            },
            {
                "id": "5cf048eb-d8bf-4929-9c82-f7f88559020f",
                "content": "No me molestes y trabaja!!",
                "timeStamp": "2024-10-29T22:22:10.174399"
            }
        ],
        "chat_members": [
            {
                "id": "3f1c5771-2c18-4e76-825a-a8ae810013f4",
                "chatId": "274cf263-07e3-402a-a3b6-76898cf38342",
                "userId": "468bb20a-da08-440d-8978-8418e2c17aa6",
                "joinedAt": "2024-10-30T01:50:27.558701"
            }
        ]
    }
]
  */

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
      const resUsers = await fetch(`/api/search/users?term=${term}`);
      const dataUsers = await resUsers.json();
      console.log('dataUsers:', dataUsers);
      
      /* dataUsers object example:
      {
        "users": [
          {
            "id": "3ff567f0-d072-4103-97f7-ae1542d0ff4b",
            "username": "roldo",
            "profilePicture": null
          },
          {
            "id": "543b5c17-9686-46b4-a4c1-e786055547f5",
            "username": "rbejar",
            "profilePicture": null
          }
        ]
      }
      */

      if (endpoint !== '') {
        const resSpecific = await fetch(`${endpoint}?term=${term}`);
        const data = await resSpecific.json();
        console.log('Specific data:', data[resultKey]);
        setSpecificResults(data[resultKey] || []);
      }

      /* data object example:
      {
    "chats": [
        {
            "id": "0ceec5b8-635b-4f75-826e-b7574424ea1c",
            "name": "javisin&roldo",
            "isGroup": false,
            "avatar": null,
            "chat_members": [
                {
                    "id": "9552720a-7f4f-4644-b6cb-072940c21a2e",
                    "chatId": "0ceec5b8-635b-4f75-826e-b7574424ea1c",
                    "userId": "468bb20a-da08-440d-8978-8418e2c17aa6",
                    "joinedAt": "2024-10-30T01:50:01.49156"
                }
            ]
        },
        {
            "id": "274cf263-07e3-402a-a3b6-76898cf38342",
            "name": "javisin&rbejar",
            "isGroup": false,
            "avatar": null,
            "chat_members": [
                {
                    "id": "3f1c5771-2c18-4e76-825a-a8ae810013f4",
                    "chatId": "274cf263-07e3-402a-a3b6-76898cf38342",
                    "userId": "468bb20a-da08-440d-8978-8418e2c17aa6",
                    "joinedAt": "2024-10-30T01:50:27.558701"
                }
            ]
        },
        {
            "id": "96293efb-ed86-44e0-ae80-aad827a5ad85",
            "name": "Rhode Island 24/25",
            "isGroup": true,
            "avatar": null,
            "chat_members": [
                {
                    "id": "08acc9af-3613-435f-9bbb-363f43520fe0",
                    "chatId": "96293efb-ed86-44e0-ae80-aad827a5ad85",
                    "userId": "468bb20a-da08-440d-8978-8418e2c17aa6",
                    "joinedAt": "2024-10-29T22:20:00.047228"
                }
            ]
        }
    ]
}
      */

      setSearchResults(dataUsers['users'] || []);
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
      // Otherwise, create a new chat
      let chat = specificResults.find((chat) => chat.chat_members.some((member) => member.id === result.id));
      if (!chat) {
        console.log('Creating chat with:', result.id);
        // chat = await createChat(result.id);
      }
      setActiveChat(chat);
    } else {
      // Handle other cases (e.g., user profile)🎃
      // You can add more cases here if needed
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
              {pathname.startsWith('/home/chats') ? (
                <div className="flex items-center">
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
                </div>
              ) : (
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
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
