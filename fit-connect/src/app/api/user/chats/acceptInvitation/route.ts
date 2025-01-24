import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();
    const supabase = createClient();
    const currentUser = await getUserInfo();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1) Check if there's a membership row with joinedAt = null
    const { data: membership, error: membershipError } = await supabase
      .from('chat_members')
      .select('*')
      .eq('chatId', chatId)
      .eq('userId', currentUser.id)
      .is('joinedAt', null)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'No pending invitation found for this chat' }, { status: 404 });
    }

    // 2) Update joinedAt to now
    const { data: updated, error: updateError } = await supabase
      .from('chat_members')
      .update({ joinedAt: new Date().toISOString() })
      .eq('id', membership.id)
      .select();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Optionally fetch and return the full chat info now that user is joined
    const { data: chatData } = await supabase.from('chats').select('id, name, isGroup, avatar').eq('id', chatId).single();

    return NextResponse.json({ message: 'Invitation accepted', chat: chatData }, { status: 200 });
  } catch (err: any) {
    console.error('Error accepting invitation:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
