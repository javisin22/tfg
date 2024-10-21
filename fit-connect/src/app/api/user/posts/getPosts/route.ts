import { getUserInfo } from '@/utils/user';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET request for getting the posts of the user logged in
export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();

    const supabase = createClient();
    const { data, error } = await supabase.from('posts').select('*').eq('userId', userData.id);

    if (error) {
      console.log('error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('data:', data);
    return NextResponse.json({ posts: data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
