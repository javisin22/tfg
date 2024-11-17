import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// /api/user/deleteUser
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Get user session data
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Error fetching user session');

    const userEmail = authData?.user?.email;
    const userId = authData?.user?.id;

    // Delete user details from the database
    const { error: userError } = await supabase.from('users').delete().eq('email', userEmail);
    if (userError) throw new Error(userError.message);

    // 🎃 Delete related information from other tables: posts, comments, likes?, chats, messages, workouts, events, etc.

    // Delete user authentication
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);
    if (authDeleteError) throw new Error('Error deleting user authentication');

    return NextResponse.json({ message: 'User account deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
