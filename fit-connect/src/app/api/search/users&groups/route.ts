import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// api/search/all?term=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term')?.toLowerCase();

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();

    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, profilePicture')
      .ilike('username', `%${term}%`);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }

    // Fetch groups
    const { data: groups, error: groupsError } = await supabase
      .from('chats')
      .select('id, name, avatar, isGroup')
      .eq('isGroup', true)
      .ilike('name', `%${term}%`);

    if (groupsError) {
      console.error('Error fetching groups:', groupsError);
      return NextResponse.json({ error: 'Error fetching groups' }, { status: 500 });
    }
      
    const results = [...users, ...groups];
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Error performing search' }, { status: 500 });
  }
}
