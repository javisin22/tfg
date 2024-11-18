import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

// '/api/posts/like'
export async function POST(req: Request) {
  const { postId } = await req.json();

  try {
    const supabase = createClient();
    const userData = await getUserInfo();
    const userId = userData.id;

    // Check if the post is already liked by the user
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select()
      .eq('postId', postId)
      .eq('userId', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingLike) {
      // If the post is already liked, remove the like (dislike)
      const { error: deleteError } = await supabase.from('post_likes').delete().eq('postId', postId).eq('userId', userId);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: 'disliked' }, { status: 200 });
    } else {
      // If the post is not liked, add the like
      const { data, error: insertError } = await supabase.from('post_likes').insert([{ postId, userId }]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: 'liked', like: data }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
