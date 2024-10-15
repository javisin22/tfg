import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// 🎃 TODO, FALTA POR IMPLEMENTAR
export async function POST(req: Request) {
  const { postId, userId } = await req.json();

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('likes').insert([{ postId, userId }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ like: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
