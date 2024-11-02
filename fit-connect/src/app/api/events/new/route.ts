import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// 'api/events/new'
export async function POST(req: Request) {
  try {
    // Get the userId from the API call to /api/user/info
    const user = await getUserInfo();
    const userId = user.id;
    const supabase = createClient();
    
    // Parse the request body
    const { name, date, location, maxParticipants, description, media } = await req.json();

    // Insert the new event into the database: name, description, organizerId, date, location, maxParticipants, media
    const { data: newEvent, error: newEventError } = await supabase.from('events').insert([
      {
        name,
        date,
        location,
        maxParticipants,
        description,
        media,
        organizerId: userId,
      },
    ]);

    // console.log('newEvent:', newEvent);

    if (newEventError) {
      console.error('error:', newEventError);
      return NextResponse.json({ error: newEventError.message }, { status: 500 });
    }

    return NextResponse.json({ event: newEvent }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
