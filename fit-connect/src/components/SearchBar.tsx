import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();

  const handleSearch = async () => {
    // 🎃 TODO: IMPLEMENTAR APIS DE SEARCH BAR 🎃 (falta la ruta de '/home/profile/[id]' por ejemplo)
    // let endpoint = ''
    // if (pathname.startsWith('/home')) {
    //   endpoint = '/api/search/users'
    // } else if (pathname.startsWith('/home/chats')) {
    //   endpoint = '/api/search/chat-users'
    // } else if (pathname.startsWith('/home/events')) {
    //   endpoint = '/api/search/events'
    // } else {
    //   console.log('Search not implemented for this route')
    //   return
    // }
    // try {
    //   const response = await fetch(`${endpoint}?term=${searchTerm}`)
    //   const data = await response.json()
    //   console.log('Search results:', data)
    //   // Handle the search results here (e.g., update state, display results)
    // } catch (error) {
    //   console.error('Error performing search:', error)
    // }
  };

  useEffect(() => {
    setSearchTerm(''); // Reset search term when route changes
  }, [pathname]);

  return (
    <div className="flex items-center bg-white p-2 rounded-md">
      <Search className="w-5 h-5 mr-2 text-black" />
      <input
        type="text"
        placeholder="Search..."
        className="outline-none text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
  );
}
