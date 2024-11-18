import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  const { id, action } = params;

  try {
    const userData = await getUserInfo();
    const userId = userData.id;
    const supabase = createClient();

    if (userId === id) {
      return NextResponse.json({ error: 'Cannot follow/unfollow yourself' }, { status: 400 });
    }

    if (action == 'follow') {
      // Check if already following
      const { data: existingFollow, error: checkError } = await supabase
        .from('user_followers')
        .select()
        .eq('userId', userId)
        .eq('followingId', id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        return NextResponse.json({ error: checkError.message }, { status: 500 });
      }

      if (existingFollow) {
        return NextResponse.json({ error: 'Already following this user' }, { status: 400 });
      }

      // Insert new follow relationship
      const { error: insertError } = await supabase.from('user_followers').insert([
        {
          userId,
          followingId: id,
        },
      ]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else if (action == 'unfollow') {
      // Delete follow relationship
      const { error: deleteError } = await supabase.from('user_followers').delete().eq('userId', userId).eq('followingId', id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // This method will handle the 'unfollow' action
  return POST(req, { params: { ...params, action: 'unfollow' } });
}