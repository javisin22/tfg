'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    async function fetchUserWorkouts() {
      try {
        const res = await fetch('/api/user/workouts/getWorkouts');
        const { workouts } = await res.json();
        setWorkouts(workouts);
        // console.log('User Workouts:', workouts);
      } catch (error) {
        console.error('Error fetching user workouts:', error);
      }
    }

    fetchUserWorkouts();
  }, []);

  return (
    <div className="pt-6">
      {workouts.map((workout) => (
        <div key={workout.id} className="p-4 pb-8">
          {/* <div key={workout.id} className="p-4 border-b"> */}
          <h1 className="text-xl font-semibold text-primary">{workout.name}</h1>
          <p className="text-gray-400">{workout.description}</p>
          <hr className="my-4 opacity-40" />
          <ul>
            {workout.workout_exercises.slice(0, 4).map((workout_exercise) => (
              <li key={workout_exercise.id} className="flex justify-between">
                <span>{workout_exercise.exercises.name}</span>
                <span>
                  {workout_exercise.sets} sets x {workout_exercise.reps} reps
                </span>
              </li>
            ))}
            {workout.workout_exercises.length > 4 && (
              <li className="flex justify-between">
                <span>...</span>
              </li>
            )}
          </ul>
          <Link href={`/home/workouts/${workout.id}`}>
            <button className="bg-gray-500 text-white font-medium py-2 px-4 rounded mt-4">
              View full workout
            </button>
          </Link>
        </div>
      ))}

      {/* Create New Workout Button */}
      <div className="flex justify-center mt-10">
        <Link href="/home/workouts/new">
          <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
            <Plus size={24} />
            Create New Workout
          </button>
        </Link>
      </div>
    </div>
  );
}
