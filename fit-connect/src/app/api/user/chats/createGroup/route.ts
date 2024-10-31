import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// POST call to create a new group chat
export async function POST(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    const { name, members } = await req.json();

    console.log('Creating group chat with name:', name, 'and members:', members);

    // Query to create a new group chat
    const { data: groupData, error: groupError } = await supabase
      .from('chats')
      .insert([
        {
          name,
          isGroup: true,
        },
      ])
      .select();

    if (groupError) {
      console.error('error:', groupError);
      return NextResponse.json({ error: groupError.message }, { status: 500 });
    }

    const group = groupData[0];

    // Insert rows into 'chat_members' table. Fields: chatId, userId
    const { data: chatMembers, error: errorMembers } = await supabase
      .from('chat_members')
      .insert([...members, userData.id].map((userId) => ({ chatId: group.id, userId })));

    if (errorMembers) {
      console.error('error:', errorMembers);
      return NextResponse.json({ error: errorMembers.message }, { status: 500 });
    }

    return NextResponse.json({ chat: group }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
