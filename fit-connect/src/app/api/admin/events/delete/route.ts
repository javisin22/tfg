import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { eventIds } = await req.json();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json({ error: 'eventIds is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Delete from 'events' table
    // 🎃 Check if I have ON DELETE CASCADE on 'event_members' in Supabase, if I do, it will automatically
    // remove membership rows.
    // Otherwise, I will need to explicitly delete from 'event_members' first
    const { data, error } = await supabase.from('events').delete().in('id', eventIds);

    if (error) {
      console.error('Error deleting events:', error);
      return NextResponse.json({ error: 'Failed to delete events' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Events deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing delete eventIds:', error);
    return NextResponse.json({ error: 'Error deleting events' }, { status: 500 });
  }
}
