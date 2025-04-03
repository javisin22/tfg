'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log({ data });

  const { error, data: session } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Error logging in:', error);
    return {error: error.message};
  }

  console.log({ session });

  // Fetch the user's username
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('username, role')
    .eq('email', session?.user?.email)
    .single();

  if (userError) {
    console.error('Error fetching user:', userError);
    return { error: 'Error fetching user profile' };
  }

  cookies().set('username', user?.username, { path: '/' });

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Get form data
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  if (!email || !password || !username) {
    return { error: 'Email, password and username are required' };
  }

  // First, register the user with Supabase Auth
  const { error: authError, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Error signing up:', authError);
    return { error: authError.message };
  }

  // Then add the username to the users table
  if (data.user) {
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        email: email,
        username: username,
        role: 'user',
      },
    ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return { error: 'Failed to create user profile' };
    }
  }

  // Set the username cookie
  cookies().set('username', username, { path: '/' });

  revalidatePath('/', 'layout');
  redirect('/');
}
