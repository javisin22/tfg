'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogOut } from 'lucide-react';

export default function Logout() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
    >
      <LogOut className="inline-block w-5 h-5 mr-2" />
      Logout
    </button>
  );
}
