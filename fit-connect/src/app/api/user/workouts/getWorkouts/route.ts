import { getUserInfo } from '@/utils/user';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET request for getting the workouts (and exercises in those workouts) of the user logged in
export async function GET(req: Request) {
  try {
    const userData = await getUserInfo();

    const supabase = createClient();

    const { data, error } = await supabase
      .from('workouts')
      .select(
        `
        id, 
        name, 
        description, 
        workout_exercises (
            id,
          sets,
          reps,
          lastWeightUsed,
          duration,
          exercises (
            id,
            name,
            muscularGroup,
            description
          )
        )
      `
      )
      .eq('userId', userData.id); // Filter by the logged user ID

    if (error) {
      console.error('Error fetching workouts and exercises:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Workout data:', data);
    return NextResponse.json({ workouts: data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
