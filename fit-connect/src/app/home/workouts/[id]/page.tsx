'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function FullWorkoutPage({ params }: { params: { id: string } }) {
  //   const supabase = createClient();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchWorkout = async () => {
  //       if (!params.id) return;

  //       const { data, error } = await supabase.from('workouts').select('*').eq('id', params.id).single();

  //       if (error) {
  //         console.error('Error fetching workout', error);
  //         return;
  //       }

  //       setWorkout(data);
  //       setLoading(false);
  //     };

  //     fetchWorkout();
  //   }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workout) {
    return <div>Workout not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{workout.name}</h1>
      <p className="mt-2 text-lg">{workout.description}</p>

      {/* Render the list of exercises for the workout */}
      <h2 className="mt-4 text-2xl font-semibold">Exercises</h2>
      <ul className="mt-2 space-y-4">
        {workout.exercises?.map((exercise) => (
          <li key={exercise.id} className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-medium">{exercise.name}</h3>
            <p>
              {exercise.reps} reps x {exercise.sets} sets
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
