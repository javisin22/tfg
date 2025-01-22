import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term')?.toLowerCase();

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();

    // Fetch posts with user info and filter by term

    // 1) Find all user IDs matching the username search
    // Using standard ilike + wildcard: '%term%'
    const { data: matchingUsers, error: usersError } = await supabase.from('users').select('id').ilike('username', `%${term}%`);

    if (usersError) {
      console.error('Error searching users:', usersError);
      return NextResponse.json({ error: 'Error searching users' }, { status: 500 });
    }

    // Extract user IDs as a comma-separated string (e.g. "uuid1,uuid2,...")
    const userIds = matchingUsers?.map((u) => u.id) || [];
    // If no matching users, use a dummy UUID so it won’t match any actual userId
    const userIdsString = userIds.length > 0 ? userIds.join(',') : '00000000-0000-0000-0000-000000000000'; // or any nonexistent UUID

    // 2) Combine both conditions in a single .or(...) call:
    //    description matches OR userId in <list of matching user IDs>
    // Note the single string with commas separating each filter condition
    const orFilter = `description.ilike.%${term}%,userId.in.(${userIdsString})`;

    // 3) Query the posts table with the combined OR filter
    //    including the related user's username for display
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(
        `
          id,
          description,
          media,
          postedAt,
          userId,
          users!inner(
            username
          )
        `
      )
      .or(orFilter)
      .limit(20);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }

    console.log('Found matching posts:', posts);
    return NextResponse.json({ results: posts });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Error performing search' }, { status: 500 });
  }
}
