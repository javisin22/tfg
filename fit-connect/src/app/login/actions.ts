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
    redirect('/error');
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
    redirect('/error');
  }

  cookies().set('username', user?.username, { path: '/' });
  cookies().set('role', user?.role, { path: '/' });


  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Error signing up:', error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
