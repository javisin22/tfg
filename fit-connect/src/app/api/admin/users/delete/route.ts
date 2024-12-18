import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/user';

// api/admin/users/delete
export async function POST(req: Request) {
  const { userIds } = await req.json();

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: 'User IDs are required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const userData = await getUserInfo();

    // Ensure the current user is an admin
    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete users
    const { data: users, error } = await supabase.from('users').delete().in('id', userIds);

    if (error) {
      console.error('Error deleting users:', error);
      return NextResponse.json({ error: 'Error deleting users' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Users deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting users:', error);
    return NextResponse.json({ error: 'Error deleting users' }, { status: 500 });
  }
}
