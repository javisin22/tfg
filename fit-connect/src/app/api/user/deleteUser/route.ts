import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';


// /api/user/deleteUser
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    const userData = await getUserInfo();
    const userId = userData.id;

    // Get user session data
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Error fetching user session: ' + authError.message);
    const userIdAuth = authData?.user?.id;

    // 1. Delete the row in public.users via the service role
    await supabaseAdmin.from('users').delete().eq('id', userId);

    // 2. Delete the auth record
    await supabaseAdmin.auth.admin.deleteUser(userIdAuth);

    return NextResponse.json({ message: 'User account deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
