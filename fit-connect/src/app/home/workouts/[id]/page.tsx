'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '../../../../components/Loading';

export default function FullWorkoutPage() {
  const { id } = useParams();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the workout data from the API
  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await fetch(`/api/user/${id}/workouts`);
        const { workout } = await res.json();
        setWorkout(workout);
        console.log('Workout:', workout);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workout:', error);
      }
    }

    fetchWorkout();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{workout[0].name}</h1>
      <p className="mt-2 text-lg text-gray-300">{workout[0].description}</p>

      {/* Render the list of exercises for the workout */}
      <h2 className="mt-4 text-2xl font-semibold">Exercises</h2>
      <ul className="mt-2 space-y-4">
        {workout[0].workout_exercises?.map((exercise) => (
          <li
            key={exercise.id}
            className="p-4 bg-gray-100 rounded-lg shadow transition-transform transform hover:scale-105 max-w-full md:max-w-3xl lg:max-w-4xl mx-auto md:mx-0"
          >
            <h3 className="pb-3 text-xl font-medium text-black">{exercise.exercises.name}</h3>
            {/* Bullet list */}
            <ul className="list-disc pl-5">
              <li className="pb-1 text-black">
                <u>Description:</u> {exercise.exercises.description}
              </li>
              <li className="pb-1 text-black">
                <u>Muscular Group:</u> {exercise.exercises.muscularGroup}
              </li>
              <li className="pb-1 text-black">
                {exercise.reps} reps x {exercise.sets} sets
              </li>
              <li className="text-black">
                <u>Last weight used:</u> {exercise.lastWeightUsed} kg
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
