import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// 'api/events/info'
export async function GET() {
  try {
    const supabase = createClient();

    // Query to get event information
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*, users:organizerId (username)');

    if (eventsError) {
      console.error('error:', eventsError);
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    return NextResponse.json({ events: eventsData }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
