import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const userData = await getUserInfo();
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = userData.id;
    const { data: memberships, error } = await supabase.from('event_members').select('eventId').eq('userId', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const eventIds = memberships?.map((membership) => membership.eventId) || [];
    return NextResponse.json({ eventIds }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
