'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Loading from '../../../components/Loading';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    async function fetchUserWorkouts() {
      try {
        const res = await fetch('/api/user/workouts/getWorkouts');
        const { workouts } = await res.json();
        setWorkouts(workouts);
      } catch (error) {
        console.error('Error fetching user workouts:', error);
      }
    }

    fetchUserWorkouts();
  }, []);

  if (workouts.length === 0) {
    return <Loading />;
  }

  return (
    <div className="pt-6">
      {workouts.map((workout) => (
        <div key={workout.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">{workout.name}</h1>
          <p className="text-gray-600 mb-4">{workout.description}</p>
          <hr className=" h-[2px] my-2 bg-gray-500 border-0 rounded-sm" />
          <ul>
            {workout.workout_exercises.slice(0, 4).map((workout_exercise) => (
              <li key={workout_exercise.id} className="flex justify-between text-gray-800 py-1">
                <span>{workout_exercise.exercises.name}</span>
                <span>
                  {workout_exercise.sets} sets x {workout_exercise.reps} reps
                </span>
              </li>
            ))}
            {workout.workout_exercises.length > 4 && (
              <li className="flex justify-center text-gray-500 py-1">
                <span>...</span>
              </li>
            )}
          </ul>
          <div className="mt-4 flex justify-start">
            <Link href={`/home/workouts/${workout.id}`}>
              <button className="bg-gray-500 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded">
                View full workout
              </button>
            </Link>
          </div>
        </div>
      ))}

      {/* Create New Workout Button */}
      <div className="flex justify-center mt-10">
        <Link href="/home/workouts/new">
          <button className="flex items-center px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
            <Plus size={24} />
            <span className="ml-2">Create New Workout</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
