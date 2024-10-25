import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserInfo } from '@/utils/user';
import { v4 as uuidv4 } from 'uuid';

// POST request for creating a new workout for the user logged in.
// It also returns the new created workout data.
export async function POST(req: Request) {
  try {
    const { workout, workout_exercises } = await req.json();
    const user = await getUserInfo();
    const userId = user.id;

    const supabase = createClient();

    // Create a new workout
    const { data: newWorkout, error: createWorkoutError } = await supabase
      .from('workouts')
      .insert([{ ...workout, userId: userId }])
      .select(); // Ensure we get the inserted workout data

    if (createWorkoutError) {
      console.log('Create workout error:', createWorkoutError);
      return NextResponse.json({ error: createWorkoutError.message }, { status: 500 });
    }

    const newWorkoutId = newWorkout[0].id;

    // Prepare workout_exercises for insertion
    const newWorkoutExercises = [];

    for (const exercise of workout_exercises) {
      let exerciseId = exercise.exercises.id;

      // If the exercise does not have an ID, it means it's a new exercise
      if (!exerciseId) {
        exerciseId = uuidv4();

        // Insert the new exercise into the exercises table
        const { error: insertExerciseError } = await supabase.from('exercises').insert({
          id: exerciseId,
          name: exercise.exercises.name,
          muscularGroup: exercise.exercises.muscularGroup,
        });

        if (insertExerciseError) {
          console.log('Insert exercise error:', insertExerciseError);
          return NextResponse.json({ error: insertExerciseError.message }, { status: 500 });
        }
      }

      newWorkoutExercises.push({
        id: uuidv4(),
        workoutId: newWorkoutId,
        exerciseId: exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        lastWeightUsed: exercise.lastWeightUsed,
        duration: exercise.duration,
      });
    }

    // Insert workout_exercises for the new workout
    const { error: createWorkoutExercisesError } = await supabase
      .from('workout_exercises')
      .insert(newWorkoutExercises);

    if (createWorkoutExercisesError) {
      console.log('Create workout_exercises error:', createWorkoutExercisesError);
      return NextResponse.json({ error: createWorkoutExercisesError.message }, { status: 500 });
    }

    // Fetch the newly created workout with its exercises to return it
    const { data: createdWorkout, error: fetchError } = await supabase
      .from('workouts')
      .select('*, workout_exercises(*, exercises(*))')
      .eq('id', newWorkoutId)
      .single();

    if (fetchError) {
      console.log('Fetch created workout error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ workout: createdWorkout }, { status: 200 });
  } catch (error) {
    console.error('Create workout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
