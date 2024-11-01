import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// 'api/user/chats/leaveGroup/[id]'
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    // Query to count the number of members in the chat
    const { count: memberCount, error: countError } = await supabase
      .from('chat_members')
      .select('*', { count: 'exact', head: true })
      .eq('chatId', id);

    if (countError) {
      console.error('error:', countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Query to delete the user from the chat
    const { error: chatError } = await supabase
      .from('chat_members')
      .delete()
      .eq('chatId', id)
      .eq('userId', userData.id);

    if (chatError) {
      console.error('error:', chatError);
      return NextResponse.json({ error: chatError.message }, { status: 500 });
    }

    // If the user was the only member, delete the chat from the 'chats' table
    if (memberCount === 1) {
      const { error: deleteChatError } = await supabase.from('chats').delete().eq('id', id);

      if (deleteChatError) {
        console.error('error:', deleteChatError);
        return NextResponse.json({ error: deleteChatError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Left group chat successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
