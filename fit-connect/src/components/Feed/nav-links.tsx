'use client;';

import { Calendar, Dumbbell, HomeIcon, MessageCircle, Settings, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Chats', href: '/chats', icon: MessageCircle },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function NavLinks() {
  const pathname = usePathname(); // <-- Se utiliza para obtener la ruta y así renderizar cosas específicas (dashboard)

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100
                ${pathname === link.href ? 'bg-gray-100' : 'bg-white'}`} // Revisar y ajustar los estilos
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
