import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    // Query to get the list of chats the user is a part of
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

    // Fetch the other members of the chats
    const chatIds = chats.map((chat) => chat.id);
    const { data: otherMembers, error: otherMembersError } = await supabase
      .from('chat_members')
      .select('chatId, userId')
      .in('chatId', chatIds)
      .neq('userId', userData.id); // Exclude the current user

    if (otherMembersError) {
      console.error('error:', otherMembersError);
      return NextResponse.json({ error: otherMembersError.message }, { status: 500 });
    }

    // Fetch the user details of the other members
    const otherMemberIds = otherMembers.map((member) => member.userId);
    const { data: otherUsers, error: otherUsersError } = await supabase
      .from('users')
      .select('id, username')
      .in('id', otherMemberIds);

    if (otherUsersError) {
      console.error('error:', otherUsersError);
      return NextResponse.json({ error: otherUsersError.message }, { status: 500 });
    }

    // Combine the results and update the chat name
    const chatsWithMembers = chats.map((chat) => {
      const otherMember = otherMembers.find((member) => member.chatId === chat.id);
      const otherUser = otherUsers.find((user) => user.id === otherMember.userId);
      return {
        ...chat,
        name: chat.isGroup ? chat.name : otherUser.username, // Update the chat name for private chats
        otherMembers: otherMembers.filter((member) => member.chatId === chat.id),
      };
    });

    return NextResponse.json({ chats: chatsWithMembers }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
