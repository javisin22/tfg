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
    <div className="pt-3 sm:pt-6 h-[calc(100vh-120px)] overflow-y-auto">
      {workouts.map((workout) => (
        <div key={workout.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-1 sm:mb-2">{workout.name}</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{workout.description}</p>
          <hr className="h-[1px] sm:h-[2px] my-1 sm:my-2 bg-gray-500 border-0 rounded-sm" />
          <ul className="text-sm sm:text-base">
            {workout.workout_exercises.slice(0, 4).map((workout_exercise) => (
              <li key={workout_exercise.id} className="flex justify-between text-gray-800 py-0.5 sm:py-1">
                <span>{workout_exercise.exercises.name}</span>
                <span>
                  {workout_exercise.sets} sets x {workout_exercise.reps} reps
                </span>
              </li>
            ))}
            {workout.workout_exercises.length > 4 && (
              <li className="flex justify-center text-gray-500 py-0.5 sm:py-1">
                <span>...</span>
              </li>
            )}
          </ul>
          <div className="mt-3 sm:mt-4 flex justify-start">
            <Link href={`/home/workouts/${workout.id}`}>
              <button className="bg-gray-500 hover:bg-gray-800 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded">
                View full workout
              </button>
            </Link>
          </div>
        </div>
      ))}

      {/* Create New Workout Button */}
      <div className="flex justify-center mt-6 sm:mt-10 mb-4">
        <Link href="/home/workouts/new">
          <button className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-black hover:bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
            <Plus size={18} className="sm:hidden" />
            <Plus size={24} className="hidden sm:inline" />
            <span className="ml-1.5 sm:ml-2 text-sm sm:text-base">Create New Workout</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
