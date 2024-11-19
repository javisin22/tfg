import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

// Get the information of the user who is currently logged in
export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const userData = await getUserInfo();
    const userId = userData.id;

    // Count the number of users the logged-in user follows
    const { count: followingCount, error: followingCountError } = await supabase
      .from('user_followers')
      .select('id', { count: 'exact', head: true })
      .eq('userId', userId);

    if (followingCountError) {
      console.error('Error fetching following count:', followingCountError);
      return NextResponse.json({ error: followingCountError.message }, { status: 500 });
    }

    // Count the number of users that follow the logged-in user
    const { count: followersCount, error: followersCountError } = await supabase
      .from('user_followers')
      .select('id', { count: 'exact', head: true })
      .eq('followingId', userId);

    if (followersCountError) {
      console.error('Error fetching followers count:', followersCountError);
      return NextResponse.json({ error: followersCountError.message }, { status: 500 });
    }

    const userDataWithFollowInfo = {
      ...userData,
      followingCount: followingCount || 0,
      followersCount: followersCount || 0,
    };

    return NextResponse.json({ user: userDataWithFollowInfo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
