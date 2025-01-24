import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function POST(req: Request) {
  const { commentIds } = await req.json();

  if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
    return NextResponse.json({ error: 'Comment IDs are required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const userData = await getUserInfo();

    // Ensure the current user is an admin
    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete comments
    const { data: deletedComments, error } = await supabase.from('comments').delete().in('id', commentIds);

    if (error) {
      console.error('Error deleting comments:', error);
      return NextResponse.json({ error: 'Error deleting comments' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Comments deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comments:', error);
    return NextResponse.json({ error: 'Error deleting comments' }, { status: 500 });
  }
}
