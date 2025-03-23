'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, Dumbbell, HomeIcon, MessageCircle, Settings, User, X, Menu, ShieldPlus, ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logout from '../../components/Logout';
import SearchBar from '../../components/SearchBar';
import { ChatProvider } from '../../contexts/ChatContext';
import { EventsProvider } from '../../contexts/EventsContext';
import Cookies from 'js-cookie';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [role, setRole] = useState('user');
  const [activeTab, setActiveTab] = useState<string>(pathname.split('/')[2] || 'home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const initialRenderRef = useRef(true);

  const menuItems = [
    { label: 'Home', icon: HomeIcon, href: '/home' },
    { label: 'My Profile', icon: User, href: '/home/profile' },
    { label: 'Chats', icon: MessageCircle, href: '/home/chats' },
    { label: 'Workouts', icon: Dumbbell, href: '/home/workouts' },
    { label: 'Events', icon: Calendar, href: '/home/events' },
    { label: 'Settings', icon: Settings, href: '/home/settings' },
  ];

  const adminMenuItems = [
    { label: 'Manage Users', icon: User, href: '/home/admin/users' },
    { label: 'Manage Posts', icon: HomeIcon, href: '/home/admin/posts' },
    { label: 'Manage Events', icon: Calendar, href: '/home/admin/events' },
  ];

  const finalMenuItems = role === 'admin' ? [...menuItems, ...adminMenuItems] : menuItems;

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 768;
      setIsSmallScreen(isSmall);

      // Only auto-open/close sidebar on initial render
      if (initialRenderRef.current) {
        setIsSidebarOpen(!isSmall);
        initialRenderRef.current = false;
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine the active tab based on the pathname and menu
  useEffect(() => {
    // Fetch the role from the server
    async function fetchRole() {
      try {
        const res = await fetch('/api/user/role');
        if (res.ok) {
          const { role } = await res.json();
          setRole(role);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    }

    fetchRole();

    // Split the current pathname into segments
    const segments = pathname.split('/');

    // Check if the route is in the admin area
    if (segments[2] === 'admin') {
      const pathSegment = segments[3] || 'home';
      // Only mark as admin if the user is actually an admin.
      if (role === 'admin') {
        setActiveTab(`${pathSegment} (admin)`);
      } else {
        setActiveTab(pathSegment);
      }
    } else {
      // For non-admin routes, use the second segment (or default to 'home')
      setActiveTab(segments[2] || 'home');
    }
  }, [pathname]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = () => {
    // Only close sidebar on small screens when clicking menu items
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <ChatProvider>
      <EventsProvider>
        <div className="flex h-screen">
          {/* Sidebar with collapsible behavior on all screen sizes */}
          <div
            className={`fixed inset-y-0 left-0 transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'md:relative' : 'md:absolute'
            } w-52 md:w-60 p-4 bg-gray-800 text-white z-50`}
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold">FitConnect</h1>
              <div className="flex items-center">
                {/* Left arrow to collapse sidebar */}
                <button
                  className="text-white hover:text-gray-300 focus:outline-none ml-2"
                  onClick={handleSidebarToggle}
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
            <nav className="space-y-2">
              {finalMenuItems.map((item) => {
                const isActive = item.href === '/home' ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <div key={item.label}>
                    <Link href={item.href}>
                      <button
                        className={`w-full text-sm md:text-base lg:text-lg text-left py-2 px-4 rounded-md ${
                          isActive ? 'bg-gray-200 bg-opacity-80 text-black' : ''
                        }`}
                        onClick={handleMenuItemClick}
                      >
                        <div className="relative inline-block w-5 h-5 md:w-6 md:h-6 mr-2">
                          <item.icon className="inline-block w-4 h-4 md:w-5 md:h-5 mr-2" />
                          {role === 'admin' && adminMenuItems.some((adminItem) => adminItem.label === item.label) && (
                            <ShieldPlus className="absolute w-3 h-3 md:w-4 md:h-4 -top-1 -right-1" />
                          )}
                        </div>
                        {item.label}
                      </button>
                    </Link>
                    {role === 'admin' && item.label === 'Settings' && <hr className="my-4 border-gray-600" />}
                  </div>
                );
              })}
            </nav>
            <div className="mt-auto md:hidden ml-3">
              <Logout />
            </div>
          </div>

          {/* Burger Icon - visible on all screen sizes when sidebar is closed */}
          {!isSidebarOpen && (
            <button className="fixed top-3 left-3 z-50" onClick={handleSidebarToggle} aria-label="Open sidebar">
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Main content - expands when sidebar is closed */}
          <div
            className={`flex-1 overflow-hidden p-4 bg-slate-700 text-white transition-all duration-300 ${
              !isSidebarOpen ? 'w-full' : 'md:w-[calc(100%-15rem)]'
            }`}
          >
            <div className="max-w-5xl mx-auto">
              {/* Top bar */}
              <div className="flex justify-between items-center mb-4">
                {/* Active tab - adjust margin based on sidebar state */}
                <div className={`flex-1 ${!isSidebarOpen ? 'ml-6 md:ml-10' : ''} lg:ml-0`}>
                  <span className="text-lg md:text-xl font-bold">{activeTab}</span>
                </div>
                {/* Search bar */}
                <div className="flex-1 flex justify-center">
                  {pathname !== '/home/workouts' && pathname !== '/home/settings' && <SearchBar />}
                </div>
                {/* Logout button */}
                <div className="hidden md:flex flex-1 justify-end">
                  <Logout />
                </div>
              </div>
              <hr className="my-4" />
              {children}
            </div>
          </div>
        </div>
      </EventsProvider>
    </ChatProvider>
  );
}
