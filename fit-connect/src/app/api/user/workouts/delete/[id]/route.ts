import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// DELETE request for deleting an specific workout for the user logged in.
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const workoutId = params.id;

    const supabase = createClient();

    // Delete the 'workout_exercises' row for the workout
    const { error: deleteWorkoutExercisesError } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('workoutId', workoutId);

    if (deleteWorkoutExercisesError) {
      console.log('Delete workout_exercises error:', deleteWorkoutExercisesError);
      return NextResponse.json({ error: deleteWorkoutExercisesError.message }, { status: 500 });
    }

    // Delete the 'workout' row for the workout
    const { error: deleteWorkoutError } = await supabase.from('workouts').delete().eq('id', workoutId);

    if (deleteWorkoutError) {
      console.log('Delete workout error:', deleteWorkoutError);
      return NextResponse.json({ error: deleteWorkoutError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Workout deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
