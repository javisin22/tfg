import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// 'api/events/join/[id]/route.ts'
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const userData = await getUserInfo();
    const userId = userData?.id;

    const supabase = createClient();

    // Fetch the maxParticipants value from the events table
    const { data: eventData, error: eventError } = await supabase.from('events').select('maxParticipants').eq('id', id).single();

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    const maxParticipants = eventData.maxParticipants;

    // Count the number of rows in event_members for the given eventId
    const { count: memberCount, error: memberCountError } = await supabase
      .from('event_members')
      .select('id', { count: 'exact', head: true })
      .eq('eventId', id);

    if (memberCountError) {
      return NextResponse.json({ error: memberCountError.message }, { status: 500 });
    }

    // Check if the number of members is equal to maxParticipants
    if (maxParticipants !== null && memberCount >= maxParticipants) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 });
    }

    // Check if the user is already a member of the event
    const { data: existingMember, error: existingMemberError } = await supabase
      .from('event_members')
      .select('id')
      .eq('eventId', id)
      .eq('userId', userId)
      .single();

    if (existingMemberError && existingMemberError.code !== 'PGRST116') {
      return NextResponse.json({ error: existingMemberError.message }, { status: 500 });
    }

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of the event' }, { status: 409 });
    }

    // Insert the user into the event_members table
    const { data, error } = await supabase
      .from('event_members')
      .insert([{ userId: userId, eventId: id }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
