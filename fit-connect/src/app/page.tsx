import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Feed from '../components/Feed/feed';

export default async function Home() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return <Feed />;
}
