import { getUserInfo } from '@/utils/user';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET request for getting the posts of the user logged in
export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();
    const supabase = createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        comments (
          *,
          users (
            username,
            profilePicture
          )
        )
      `
      )
      .eq('userId', userData.id);

    if (error) {
      console.log('error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posts = data || [];

    // Retrieve likes count for each post
    const postIds = posts.map((post: { id: string }) => post.id);
    const { data: likesData, error: likesError } = await supabase
      .from('post_likes')
      .select('postId')
      .in('postId', postIds);
    
    if (likesError) {
      console.log('likesError:', likesError);
      return NextResponse.json({ error: likesError.message }, { status: 500 });
    }

    // Count likes manually: result is an object mapping post IDs to like counts
    const likesCount = (likesData || []).reduce((acc: Record<string, number>, like: { postId: string }) => {
      acc[like.postId] = (acc[like.postId] || 0) + 1;
      return acc;
    }, {});

    // Attach the likes count to each post
    const postsWithLikes = posts.map((post: any) => ({
      ...post,
      likes: likesCount[post.id] || 0,
    }));

    return NextResponse.json({ posts: postsWithLikes }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
