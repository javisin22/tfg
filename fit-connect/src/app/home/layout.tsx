'use client';

import { useEffect, useState } from 'react';
import { Calendar, Dumbbell, HomeIcon, MessageCircle, Settings, User, X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logout from '../../components/Logout';
import SearchBar from '../../components/SearchBar';
import { ChatProvider } from '../../contexts/ChatContext';
import { EventsProvider } from '../../contexts/EventsContext';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeTab, setActiveChat] = useState<string>(pathname.split('/')[2] || 'home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveChat(pathname.split('/')[2] || 'home');
  }, [pathname]);

  const menuItems = [
    { label: 'Home', icon: HomeIcon, href: '/home' },
    { label: 'My Profile', icon: User, href: '/home/profile' },
    { label: 'Chats', icon: MessageCircle, href: '/home/chats' },
    { label: 'Workouts', icon: Dumbbell, href: '/home/workouts' },
    { label: 'Events', icon: Calendar, href: '/home/events' },
    { label: 'Settings', icon: Settings, href: '/home/settings' },
  ];

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ChatProvider>
      <EventsProvider>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-60 p-4 bg-gray-800 text-white z-50`}
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">FitConnect</h1>
              <button className="md:hidden" onClick={handleSidebarToggle}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link href={item.href} key={item.label}>
                  <button
                    className={`w-full text-lg text-left py-2 px-4 rounded-md ${
                      pathname === item.href ? 'bg-gray-200 bg-opacity-80 text-black' : ''
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <item.icon className="inline-block w-5 h-5 mr-2" />
                    {item.label}
                  </button>
                </Link>
              ))}
            </nav>
            <div className="mt-auto md:hidden ml-3">
              <Logout />
            </div>
          </div>

          {/* Burger Icon */}
          {!isSidebarOpen && (
            <button className="md:hidden fixed top-4 left-4 z-50" onClick={handleSidebarToggle}>
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Main content */}
          <div className="flex-1 overflow-auto p-4 bg-slate-700 text-white">
            <div className="max-w-5xl mx-auto">
              {/* Top bar */}
              <div className="flex justify-between items-center mb-4">
                {/* Active tab */}
                <div className="flex-1 ml-10 md:ml-16">
                  <span className="text-xl font-bold">{activeTab}</span>
                </div>
                {/* Search bar */}
                <div className="flex-1 flex justify-center">
                  {pathname !== '/home/workouts' && pathname !== '/home/settings' && <SearchBar />}
                </div>
                {/* Logout button */}
                <div className="hidden md:flex flex-1 justify-end">
                  <Logout />
                </div>
              </div>{' '}
              <hr className="my-4" />
              {children}
            </div>
          </div>
        </div>
      </EventsProvider>
    </ChatProvider>
  );
}
