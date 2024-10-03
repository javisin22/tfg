'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Logout() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700">
      Logout
    </button>
  );
}
