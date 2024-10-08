'use client';

import Link from 'next/link';

export default function WorkoutsScreen() {
  const workouts = [
    {
      id: 1,
      name: 'Leg Day Routine',
      description: 'A 40-minute leg day workout routine to build muscle and strength.',
      exercises: [
        { id: 1, name: 'Squats', sets: 4, reps: 12 },
        { id: 2, name: 'Lunges', sets: 3, reps: 12 },
        { id: 3, name: 'Leg Press', sets: 4, reps: 12 },
        { id: 4, name: 'Leg Curls', sets: 3, reps: 12 },
      ],
    },
    {
      id: 2,
      name: 'Upper Body Strength',
      description: 'A 30-minute upper body workout to build strength and endurance.',
      exercises: [
        { id: 1, name: 'Bench Press', sets: 4, reps: 10 },
        { id: 2, name: 'Pull-Ups', sets: 3, reps: 10 },
        { id: 3, name: 'Shoulder Press', sets: 4, reps: 10 },
        { id: 4, name: 'Bicep Curls', sets: 3, reps: 10 },
      ],
    },
    {
      id: 3,
      name: 'Arm Day',
      description: 'A 45-minute arm day workout to tone and sculpt your arms.',
      exercises: [
        { id: 1, name: 'Tricep Dips', sets: 4, reps: 12 },
        { id: 2, name: 'Hammer Curls', sets: 3, reps: 12 },
        { id: 3, name: 'Skull Crushers', sets: 4, reps: 12 },
        { id: 4, name: 'Tricep Extensions', sets: 3, reps: 12 },
      ],
    },
  ];

  return (
    <div className="pt-6">
      {workouts.map((workout) => (
        <div key={workout.id} className="p-4 pb-8">
          {/* <div key={workout.id} className="p-4 border-b"> */}
          <h1 className="text-xl font-semibold text-primary">{workout.name}</h1>
          <p className="text-gray-400">{workout.description}</p>
          <hr className="my-4 opacity-40" />
          <ul>
            {workout.exercises.map((exercise) => (
              <li key={exercise.id} className="flex justify-between">
                <span>{exercise.name}</span>
                <span>
                  {exercise.sets} sets x {exercise.reps} reps
                </span>
              </li>
            ))}
          </ul>
          <Link href={`/home/workouts/${workout.id}`}>
            <button className="bg-gray-500 text-white font-medium py-2 px-4 rounded mt-4">View full workout</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
