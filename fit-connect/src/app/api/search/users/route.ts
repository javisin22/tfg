import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// api/search/users?term=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term')?.toLowerCase();

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, profilePicture')
      .ilike('username', `%${term}%`);

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }

    return NextResponse.json({ results: users });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Error performing search' }, { status: 500 });
  }
}
