import { getUserInfo } from '@/utils/user';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    // Query to get the list of chats the user is a part of with the last message
    const { data: chatsData, error: chatsError } = await supabase
      .from('chats')
      .select(
        `
        id, name, isGroup, avatar,
        chat_members!inner(*),
        lastMessage:messages (
            id, content, timeStamp
        )
        `
      )
      .eq('chat_members.userId', userData.id) // Filter by the user's membership
      .order('timeStamp', { referencedTable: 'messages', ascending: false })
      .limit(1, { foreignTable: 'messages' }); // Limit to the latest message

    // Check if a chat is a group or individual chat.
    // For individual chats, find the other participant's name
    // and use it as the chat name.

    // Process the data to update the name for private chats
    const updatedChatsData = await Promise.all(
      chatsData.map(async (chat) => {
        if (!chat.isGroup) {
          // Fetch the members of the chat
          const { data: membersData, error: membersError } = await supabase
            .from('chat_members')
            .select('userId')
            .eq('chatId', chat.id);

          if (membersError) {
            console.error('error:', membersError);
            return chat;
          }

          // Find the other participant
          const otherMember = membersData.find((member) => member.userId !== userData.id);

          if (otherMember) {
            // Fetch the username of the other participant
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('username')
              .eq('id', otherMember.userId)
              .single();

            if (userError) {
              console.error('error:', userError);
              return chat;
            }

            // Update the chat name to the username of the other participant
            chat.name = userData.username;
          }
        }

        // Extract the last message as a single value
        if (chat.lastMessage && chat.lastMessage.length > 0) {
          chat.lastMessage = chat.lastMessage[0];
        } else {
          chat.lastMessage = null;
        }
        return chat;
      })
    );

    return NextResponse.json({ chats: updatedChatsData }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
