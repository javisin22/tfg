import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

/* 
API call to the supabase database to create a new post. The request body should include the following fields:
  - description: string
  - media: string
  - workoutId: string (optional)
*/

// Create a new post in the database
export async function POST(req: Request) {
  const supabase = createClient();

  // Get the userId from the API call to /api/user/info
  const user = await getUserInfo();

  const userId = user.id;

  // Parse the request body
  const { description, media, workoutId } = await req.json();

  // Insert the new post into the database
  const { data, error } = await supabase.from('posts').insert([
    {
      userId,
      description,
      media,
      workoutId,
    },
  ]);

  console.log('data', data);
  console.log('error', error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify(data, null, 2));

  return NextResponse.json({ post: data }, { status: 200 });
}
