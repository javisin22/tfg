import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// GET call to search for the users that the logged-in user has a chat with
export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    // Query to get the list of chats the user is a part of with the last message
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select(
        `
        id, name, isGroup, avatar,
        chat_members!inner(*)
        `
      )
      .eq('chat_members.userId', userData.id) // Filter by the user's membership
      .order('id', { ascending: true });

    if (chatsError) {
      console.error('error:', chatsError);
      return NextResponse.json({ error: chatsError.message }, { status: 500 });
    }

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
