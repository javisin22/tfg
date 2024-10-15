import { createClient } from './supabase/server';

export async function getUserInfo() {
  const supabase = createClient();

  // Get user session data
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error('Error fetching user session');

  // Fetch user details from the database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, email, role, profilePicture, height, weight, biography')
    .eq('email', authData?.user?.email)
    .single();

  if (userError) throw new Error(userError.message);

  return userData;
}
