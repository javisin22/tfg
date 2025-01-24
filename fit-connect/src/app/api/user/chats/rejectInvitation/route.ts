import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();
    const supabase = createClient();
    const currentUser = await getUserInfo();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1) Check if there's a membership row with joinedAt = null
    const { data: membership, error: membershipError } = await supabase
      .from('chat_members')
      .select('id')
      .eq('chatId', chatId)
      .eq('userId', currentUser.id)
      .is('joinedAt', null)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'No pending invitation found for this chat' }, { status: 404 });
    }

    // 2) Delete that membership row
    const { error: deleteError } = await supabase.from('chat_members').delete().eq('id', membership.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Invitation rejected' }, { status: 200 });
  } catch (err: any) {
    console.error('Error rejecting invitation:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
