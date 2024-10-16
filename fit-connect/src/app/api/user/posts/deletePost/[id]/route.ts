import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// DELETE request for deleting a post depending on the id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('id:', id);
    const supabase = createClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      console.log('error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
