import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// /api/user/updateInfo
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    // const { username, email, profilePicture, biography, currentPassword, newPassword } = await request.json();
    const { username, profilePicture, biography, weight, height, currentPassword, newPassword } = await request.json();

    // Get user session data
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Error fetching user session');

    // Update user details in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({ username, profilePicture, biography, weight, height }) // email removed (for now)
      .eq('email', authData?.user?.email)
      .single();

    if (userError) throw new Error(userError.message);

    console.log(userData);

    // Update password if provided
    if (newPassword && currentPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) throw new Error('Error updating password');
    }

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
