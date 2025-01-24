import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

// Post function that adds a comment to a post
export async function POST(request: Request) {
  const supabase = createClient();
  const userData = await getUserInfo();

  const userId = userData?.id;
  const { postId, content } = await request.json();

  // Insert the comment into the database
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        userId,
        postId,
        content,
      },
    ])
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const newComment = data?.[0];

  const commentWithUserInfo = {
    ...newComment,
    users: {
      username: userData?.username,
      profilePicture: userData?.profilePicture,
    },
  };

  return NextResponse.json({ comment: commentWithUserInfo }, { status: 200 });
}
