import { getUserInfo } from '@/utils/user';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    // fetch the user's posts + nested comments & users
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(
        `
        *,
        comments (
          *,
          users ( username, profilePicture )
        )
      `
      )
      .eq('userId', userData.id);
    if (postsError) throw postsError;

    // count likes per post
    const postIds = posts.map((p) => p.id);
    const { data: allLikes, error: likesError } = await supabase.from('post_likes').select('postId').in('postId', postIds);
    if (likesError) throw likesError;
    const likesCount = (allLikes || []).reduce<Record<string, number>>((acc, l) => {
      acc[l.postId] = (acc[l.postId] || 0) + 1;
      return acc;
    }, {});
    const postsWithLikes = (posts || []).map((p) => ({
      ...p,
      likes: likesCount[p.id] || 0,
    }));

    // fetch which of these posts the current user has liked
    const { data: userLikes, error: userLikesError } = await supabase
      .from('post_likes')
      .select('postId')
      .eq('userId', userData.id)
      .in('postId', postIds);
    if (userLikesError) throw userLikesError;
    const likedPosts = (userLikes || []).map((l) => l.postId);

    return NextResponse.json({ posts: postsWithLikes, likedPosts }, { status: 200 });
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
