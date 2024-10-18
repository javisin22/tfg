// api/user/[id]/info/route.ts

import { createClient } from '../../../../../app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createClient();

  // Fetch user details from the database using userId
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, email, role, profilePicture, height, weight, biography')
    .eq('id', id)
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 404 });
  }

  return NextResponse.json({ user: userData });
}
