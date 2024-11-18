import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

// Get the information of posts from the logged-in user and the users they follow
export async function GET() {
  try {
    const supabase = createClient();

    // Get the information of the logged-in user
    const userData = await getUserInfo();
    const userId = userData.id;

    // Fetch the list of following IDs
    const { data: followingData, error: followingError } = await supabase
      .from('user_followers')
      .select('followingId')
      .eq('userId', userId);

    if (followingError) {
      console.error('Error fetching following IDs:', followingError);
      return NextResponse.json({ error: followingError.message }, { status: 500 });
    }

    const followingIds = followingData.map((item: { followingId: string }) => item.followingId);

    // Include the logged-in user's ID in the list of IDs to fetch posts for
    const userIds = [userId, ...followingIds];

    // Fetch posts from the logged-in user and the users they follow
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(
        `
        id, postedAt, userId, description, media, workoutId,
        users:users (
          username, profilePicture
        ),
        comments (
          id, userId, postId, postedAt, content,
          users:users (
            username, profilePicture
          )
        )
      `
      )
      .in('userId', userIds);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    // Fetch likes count for each post
    const postIds = posts.map((post: { id: string }) => post.id);
    const { data: likesData, error: likesError } = await supabase
      .from('post_likes')
      .select('postId')
      .in('postId', postIds)
      .then((result) => {
        // Count likes manually
        const likesCount = result.data?.reduce((acc: Record<string, number>, like: { postId: string }) => {
          acc[like.postId] = (acc[like.postId] || 0) + 1;
          return acc;
        }, {});
        return { data: Object.entries(likesCount).map(([postId, count]) => ({ postId, count })) };
      });

    if (likesError) {
      console.error('Error fetching likes:', likesError);
      return NextResponse.json({ error: likesError.message }, { status: 500 });
    }

    // Map likes count to posts
    const likesMap = likesData.reduce((acc: any, like: { postId: string; count: number }) => {
      acc[like.postId] = like.count;
      return acc;
    }, {});

    const postsWithLikes = posts.map((post: any) => ({
      ...post,
      likes: likesMap[post.id] || 0,
    }));

    console.log('Fetched posts with likes:', JSON.stringify(postsWithLikes, null, 2));

    // Fetch liked posts for the logged-in user
    const { data: likedPostsData, error: likedPostsError } = await supabase
      .from('post_likes')
      .select('postId')
      .eq('userId', userId);

    if (likedPostsError) {
      console.error('Error fetching liked posts:', likedPostsError);
      return NextResponse.json({ error: likedPostsError.message }, { status: 500 });
    }

    const likedPosts = likedPostsData.map((like: { postId: string }) => like.postId);

    return NextResponse.json({ posts: postsWithLikes, likedPosts }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
