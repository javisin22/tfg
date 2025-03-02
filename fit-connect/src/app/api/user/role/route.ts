import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();

  // getUser() verifies with the Supabase Auth server
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  // Get the user role from the database using the verified user email
  const { data: userData, error } = await supabase.from('users').select('role').eq('email', user.email).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ role: userData?.role || 'user' });
}
