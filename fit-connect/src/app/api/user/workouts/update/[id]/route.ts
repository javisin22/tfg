import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

// UPDATE request for updating a specific workout and its exercises for the user logged in.
// It also returns the new updated workout data.
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const workoutId = params.id;
    const { workout_exercises } = await req.json(); // Updated list of workout_exercises

    const supabase = createClient();

    for (const exercise of workout_exercises) {
      if (exercise.id) {
        // Update the workout_exercises table for existing exercises
        const { error: updateWorkoutExerciseError } = await supabase
          .from('workout_exercises')
          .update({
            sets: exercise.sets,
            reps: exercise.reps,
            lastWeightUsed: exercise.lastWeightUsed,
            duration: exercise.duration,
          })
          .eq('workoutId', workoutId)
          .eq('exerciseId', exercise.exercises.id);

        if (updateWorkoutExerciseError) {
          console.log('Update workout_exercises error:', updateWorkoutExerciseError);
          return NextResponse.json({ error: updateWorkoutExerciseError.message }, { status: 500 });
        }

        // Update the exercise table for existing exercises
        const { error: updateExerciseError } = await supabase
          .from('exercises')
          .update({
            name: exercise.exercises.name,
            muscularGroup: exercise.exercises.muscularGroup,
          })
          .eq('id', exercise.exercises.id);

        if (updateExerciseError) {
          console.log('Update exercise error:', updateExerciseError);
          return NextResponse.json({ error: updateExerciseError.message }, { status: 500 });
        }
      } else {
        // Generate a new UUID for the new exercise
        const newExerciseId = uuidv4();

        // Insert new exercises into the exercises table
        const { data: insertedExercise, error: insertExerciseError } = await supabase
          .from('exercises')
          .insert({
            id: newExerciseId,
            name: exercise.exercises.name,
            muscularGroup: exercise.exercises.muscularGroup,
          })
          .select(); // Ensure we get the inserted exercise data

        if (insertExerciseError) {
          console.log('Insert exercise error:', insertExerciseError);
          return NextResponse.json({ error: insertExerciseError.message }, { status: 500 });
        }

        // Insert new exercises into the workout_exercises table
        const { error: insertWorkoutExerciseError } = await supabase.from('workout_exercises').insert({
          workoutId,
          exerciseId: newExerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          lastWeightUsed: exercise.lastWeightUsed,
          duration: exercise.duration,
        });

        if (insertWorkoutExerciseError) {
          console.log('Insert workout_exercises error:', insertWorkoutExerciseError);
          return NextResponse.json({ error: insertWorkoutExerciseError.message }, { status: 500 });
        }
      }
    }

    // Fetch the updated workout to return it
    const { data: updatedWorkout, error: fetchError } = await supabase
      .from('workouts')
      .select('*, workout_exercises(*, exercises(*))')
      .eq('id', workoutId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ workout: updatedWorkout }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
