import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function POST(req: Request) {
  try {
    const { chatId, invitedUserId } = await req.json();
    const supabase = createClient();
    const currentUser = await getUserInfo();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1) Check if the chat is a group chat AND the current user is already in it
    const { data: chatData, error: chatError } = await supabase.from('chats').select('id, isGroup').eq('id', chatId).single();

    if (chatError || !chatData) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    if (!chatData.isGroup) {
      return NextResponse.json({ error: 'Cannot invite users to a 1-on-1 chat' }, { status: 400 });
    }

    // Check current user membership (joinedAt not null) to ensure they are truly in the group
    const { data: currentMembership, error: membershipError } = await supabase
      .from('chat_members')
      .select('id, joinedAt')
      .eq('chatId', chatId)
      .eq('userId', currentUser.id)
      .maybeSingle();

    if (membershipError || !currentMembership || !currentMembership.joinedAt) {
      return NextResponse.json({ error: 'You must be a member of this group to invite others' }, { status: 403 });
    }

    // 2) Insert the pending membership for invitedUserId
    //    (joinedAt = null => "invitation" not yet accepted)
    const { data: insertData, error: insertError } = await supabase
      .from('chat_members')
      .insert([
        {
          chatId,
          userId: invitedUserId,
          joinedAt: null, // pending
        },
      ])
      .select();

    if (insertError) {
      // If the row already exists, you may get a unique constraint error
      // You could handle that with a special message
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Invitation sent successfully', membership: insertData?.[0] }, { status: 200 });
  } catch (err: any) {
    console.error('Error inviting user:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
