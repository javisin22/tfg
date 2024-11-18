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

    console.log('Fetched posts:', JSON.stringify(posts, null, 2));

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
