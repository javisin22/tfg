import { createClient } from '../../../../../app/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const supabase = createClient();
    const currentUser = await getUserInfo();

    // Fetch user posts from the database using userId
    const { data: posts, error } = await supabase
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
      .eq('userId', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Get the post IDs
    const postIds = posts.map((post: { id: string }) => post.id);

    // Retrieve likes count for each post
    const { data: likesData, error: likesError } = await supabase
      .from('post_likes')
      .select('postId, userId')
      .in('postId', postIds);

    if (likesError) {
      console.error('Error fetching likes:', likesError);
    }

    // Calculate likes count and if current user liked each post
    const postsWithLikes = posts.map((post: any) => {
      const likesForPost = (likesData || []).filter((like: any) => like.postId === post.id);
      const likesCount = likesForPost.length;
      const likedByUser = likesForPost.some((like: any) => like.userId === currentUser.id);
      return { ...post, likes: likesCount, likedByUser };
    });

    return NextResponse.json({ posts: postsWithLikes }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
