import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// api/search/events?term=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term')?.toLowerCase();

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const { data: events, error } = await supabase
      .from('events')
      .select('*, users:organizerId (username)')
      .ilike('name', `%${term}%`);

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
    }

    return NextResponse.json({ results: events });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Error performing search' }, { status: 500 });
  }
}
