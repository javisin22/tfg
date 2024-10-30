import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// POST call to create a new chat within the logged-in user and another user
export async function POST(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    const { userId } = await req.json();

    console.log('Creating chat with user:', userId);

    /*
            In order to create new chat:
              - Insert a new row in 'chats' with: 
                 - username1&'username2' for field 'name'
                 - isGroup = false
              - Insert two new rows in 'chat_members':
                * First row:
                    - chatId = chatId (retrieved from the first query)
                    - userId = userId (retrieved from the request)
                * Second row:
                    - chatId = chatId (retrieved from the first query)
                    - userId = userData.id (retrieved from the getUserInfo() call)
        */

    // Query to create a new chat
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .insert([
        {
          name: `${userData.username}&${userId}`,
          isGroup: false,
        },
      ])
      .select();

    if (chatError) {
      console.error('error:', chatError);
      return NextResponse.json({ error: chatError.message }, { status: 500 });
    }

    // Query to add the logged-in user to the chat
    const { data: memberData, error: memberError } = await supabase
      .from('chat_members')
      .insert([
        {
          // Logged in user
          chatId: chatData[0].id,
          userId: userData.id,
        },
        {
          // User to create chat with
          chatId: chatData[0].id,
          userId,
        },
      ])
      .select();

    if (memberError) {
      console.error('error:', memberError);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    // Fetch the username of the other user
    const { data: otherUserData, error: otherUserError } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single();

    if (otherUserError) {
      console.error('error:', otherUserError);
      return NextResponse.json({ error: otherUserError.message }, { status: 500 });
    }

    chatData[0].name = otherUserData.username;

    return NextResponse.json({ chat: chatData[0] }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
