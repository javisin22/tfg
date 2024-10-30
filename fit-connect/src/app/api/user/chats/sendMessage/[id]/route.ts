import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    const { content } = await req.json();

    console.log('Sending message:', content);

    // Query to send a message to the chat
    const { data: messageData, error: messageError } = await supabase.from('messages').insert([
      {
        chatId: id,
        senderId: userData.id,
        content,
      },
    ]).select();

    if (messageError) {
      console.error('error:', messageError);
      return NextResponse.json({ error: messageError.message }, { status: 500 });
    }

    return NextResponse.json({ message: messageData[0] }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
