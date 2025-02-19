// api/user/[id]/info/route.ts

import { createClient } from '../../../../../app/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const supabase = createClient();

    // Get the information of the user who is currently logged in
    const userData = await getUserInfo();
    const userId = userData.id;

    // Fetch user details from the database using userId
    const { data: userInfo, error: userError } = await supabase
      .from('users')
      .select('id, username, email, role, profilePicture, height, weight, biography')
      .eq('id', id)
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 404 });
    }
   
    // Check if the current user is following the profile user
    const { data: followData, error: followError } = await supabase
      .from('user_followers')
      .select('id')
      .eq('userId', userId)
      .eq('followingId', id)
      .single();

    if (followError && followError.code !== 'PGRST116') {
      return NextResponse.json({ error: followError.message }, { status: 500 });
    }

    console.log('Follow Data:', followData);

    // Count the number of followers for the profile user
    const { count: followersCount, error: countError } = await supabase
      .from('user_followers')
      .select('id', { count: 'exact', head: true })
      .eq('followingId', id);

    console.log('Followers Count:', followersCount);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const userDataWithFollowInfo = {
      ...userInfo,
      isFollowing: followData ? true : false,
      followersCount: followersCount || 0,
    };

    return NextResponse.json({ user: userDataWithFollowInfo });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
