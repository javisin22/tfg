import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Post function that adds a comment to a post
export async function POST(request: Request) {
  const supabase = createClient();

  const { userId, postId, content } = await request.json();
  console.log(userId, postId, content);

  // Insert the comment into the database
  const { data, error } = await supabase.from('comments').insert([
    {
      userId: userId,
      postId: postId,
      content: content,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 200 });
}
