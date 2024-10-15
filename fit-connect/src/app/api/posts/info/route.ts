import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Get the information of all posts from the database
export async function GET() {
  const supabase = createClient();

  // Fetch posts from the database. Include comments for each post, and the username of the user who posted the comment.
  const { data, error } = await supabase.from('posts').select(`
    id, postedAt, userId, description, media, workoutId,
    users:users (
      username, profilePicture
    ),
    comments (id, userId, postId, postedAt, content,
      users:users (
        username, profilePicture
      )
    )
  `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify(data, null, 2));

  return NextResponse.json({ posts: data }, { status: 200 });
}
