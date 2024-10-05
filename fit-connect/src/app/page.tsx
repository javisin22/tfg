import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not logged in, redirect to the login page
  if (!session) {
    redirect('/login');
  }

  // If the user is logged in, render to the feed page.
  // The redirection is to /home instead of the default '/' route
  // because of the layout structure required it to be so
  redirect('/home');  
}
