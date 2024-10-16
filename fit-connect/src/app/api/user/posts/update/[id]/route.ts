import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// UPDATE request for updating a post depending on the id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Get the id from the params and the description, media, and workoutId from the body
    const id = params.id;
    const { description, media, workoutId } = await req.json();

    const supabase = createClient();
    const { data, error } = await supabase
      .from('posts')
      .update({ description, media, workoutId })
      .eq('id', id)
      .select(); // Explicitly request to return the updated rows

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Post not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({ post: data[0] }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
