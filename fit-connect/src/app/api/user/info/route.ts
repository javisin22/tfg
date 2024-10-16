// API call to the supabase database in order to retrieve the user logged in information (userId, username, email, role, etc.)

import { getUserInfo } from '@/utils/user';
import { NextResponse } from 'next/server';

// Get the information of the user who is currently logged in
export async function GET(request: Request) {
  try {
    const userData = await getUserInfo();
    // console.log('userData', userData);
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
