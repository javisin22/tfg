import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const supabase = createClient();

    // Query to get messages along with the sender's username
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(
        `
        id, chatId, senderId, content, timeStamp,
        sender:users (username)
      `
      )
      .eq('chatId', id)
      .order('timeStamp', { ascending: true });

    if (messagesError) {
      console.error('error:', messagesError);
      return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    return NextResponse.json({ messages: messagesData }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
