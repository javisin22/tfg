'use client';

import { useState } from 'react';
import { Calendar, Dumbbell, HomeIcon, MessageCircle, Settings, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logout from '../../components/Logout';
import SearchBar from '../../components/SearchBar';
import { ChatProvider } from '../../contexts/ChatContext';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeTab] = useState<string>(pathname.substring(1) || 'Home');

  // console.log('Pathname: ', pathname);

  const menuItems = [
    { label: 'Home', icon: HomeIcon, href: '/home' },
    { label: 'My Profile', icon: User, href: '/home/profile' },
    { label: 'Chats', icon: MessageCircle, href: '/home/chats' },
    { label: 'Workouts', icon: Dumbbell, href: '/home/workouts' },
    { label: 'Events', icon: Calendar, href: '/home/events' },
    { label: 'Settings', icon: Settings, href: '/home/settings' },
  ];

  return (
    <ChatProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-60 p-4 bg-gray-800 text-white">
          <h1 className="text-2xl font-bold mb-4">FitConnect</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link href={item.href} key={item.label}>
                <button
                  className={`w-full text-lg text-left py-2 px-4 rounded-md ${
                    pathname === item.href ? 'bg-gray-200 bg-opacity-80 text-black' : ''
                  }`}
                >
                  <item.icon className="inline-block w-5 h-5 mr-2" />
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-700 text-white ">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-4">
            {/* Active tab */}
            <div className="flex-1">
              <span className="text-xl font-bold">{activeTab}</span>
            </div>
            {/* Search bar */}
            <div className="flex-1 flex justify-center">
              <SearchBar />
            </div>
            {/* Logout button */}
            <div className="flex-1 flex justify-end">
              <Logout />
            </div>
          </div>
          <hr className="my-4" />
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}
