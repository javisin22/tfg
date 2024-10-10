import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  // Fetch posts from the database
  const { data, error } = await supabase.from('posts').select(`
        id,
        posted-at,
        user-id,
        description,
        media,
        workout-id,
        comments (id, user-id, post-id, posted-at, content)
      `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log({ data });

  return NextResponse.json({ posts: data }, { status: 200 });
}
