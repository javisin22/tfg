import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// /api/user/deleteUser
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Get user session data
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Error fetching user session');

    // Delete user details from the database
    const { error: userError } = await supabase.from('users').delete().eq('email', authData?.user?.email);

    if (userError) throw new Error(userError.message);

    // Delete user authentication
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
    if (authDeleteError) throw new Error('Error deleting user authentication');

    return NextResponse.json({ message: 'User account deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
