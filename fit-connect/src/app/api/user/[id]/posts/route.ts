import { createClient } from '../../../../../app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const supabase = createClient();
    // Fetch user posts from the database using userId
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        comments (
          *,
          users (
            username,
            profilePicture
          )
        )
      `
      )
      .eq('userId', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ posts: data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
