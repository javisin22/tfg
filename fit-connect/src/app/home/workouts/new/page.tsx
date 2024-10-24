'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Loading from '../../../../components/Loading';

export default function CreateWorkoutPage() {
  const router = useRouter();

  const [workout, setWorkout] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [newExercises, setNewExercises] = useState([]);

  const handleSave = async () => {
    setLoading(true);

    // API call to create the new workout
    try {
    //   const res = await fetch('/api/user/workouts/create', { // 🎃 Create the API call!!
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ workout, workout_exercises: newExercises }),
    //   });
    //   if (!res.ok) {
    //     throw new Error('Failed to create workout');
    //   }

    //   const { workout: newWorkout } = await res.json();
    //   console.log('Created workout:', newWorkout);
    //   setLoading(false);

    //   // Redirect to the new workout page
    //   router.push(`/home/workouts/${newWorkout.id}`);
    } catch (error) {
      console.error('Error creating workout:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/home/workouts');
  };

  const handleWorkoutChange = (field, value) => {
    setWorkout((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExercise = () => {
    setNewExercises((prev) => [
      ...prev,
      {
        id: null,
        exercises: { name: '', muscularGroup: '' },
        sets: 0,
        reps: 0,
        lastWeightUsed: 0,
        duration: 0,
      },
    ]);
  };

  const handleNewExerciseChange = (index, field, value) => {
    const updatedNewExercises = [...newExercises];
    if (field === 'name' || field === 'muscularGroup') {
      updatedNewExercises[index].exercises[field] = value;
    } else {
      updatedNewExercises[index][field] = value;
    }
    setNewExercises(updatedNewExercises);
  };

  const handleRemoveNewExercise = (index) => {
    const updatedNewExercises = newExercises.filter((_, i) => i !== index);
    setNewExercises(updatedNewExercises);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create New Workout</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white">Workout Name</label>
        <input
          type="text"
          value={workout.name}
          onChange={(e) => handleWorkoutChange('name', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white">Description</label>
        <textarea
          value={workout.description}
          onChange={(e) => handleWorkoutChange('description', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Render the list of exercises for the workout */}
      <table className="min-w-full divide-y divide-gray-200 mt-2">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
            ></th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
            >
              Exercise
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
            >
              Muscular Group
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
            >
              Sets
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
            >
              Reps
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
            >
              Last Weight Used (lb)
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {newExercises.map((exercise, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleRemoveNewExercise(index)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                    <Minus className="h-4 w-4" />
                  </div>
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-black">
                <input
                  type="text"
                  value={exercise.exercises.name}
                  onChange={(e) => handleNewExerciseChange(index, 'name', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-black">
                <input
                  type="text"
                  value={exercise.exercises.muscularGroup}
                  onChange={(e) => handleNewExerciseChange(index, 'muscularGroup', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-black">
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => handleNewExerciseChange(index, 'sets', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-black">
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleNewExerciseChange(index, 'reps', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-black">
                <input
                  type="number"
                  value={exercise.lastWeightUsed}
                  onChange={(e) => handleNewExerciseChange(index, 'lastWeightUsed', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleAddExercise}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Exercise
        </button>
      </div>

      <div className="flex justify-center space-x-20 mt-10">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
