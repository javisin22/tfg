'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Loading from '../../../../components/Loading';
import { useRouter } from 'next/navigation';

export default function FullWorkoutPage() {
  const { id } = useParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercises, setEditedExercises] = useState([]);
  const [newExercises, setNewExercises] = useState([]);
  const [isWeightInKg, setIsWeightInKg] = useState(true);

  // Fetch the workout data from the API
  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await fetch(`/api/user/${id}/workouts`);
        const { workout } = await res.json();
        setWorkout(workout[0]);
        console.log('Workout:', workout);
        setLoading(false);
        setEditedExercises(workout[0].workout_exercises);
      } catch (error) {
        console.error('Error fetching workout:', error);
      }
    }

    fetchWorkout();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Combine edited and new exercises
    const allExercises = [...editedExercises, ...newExercises];

    // API call to update the workout
    try {
      const res = await fetch(`/api/user/workouts/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workout_exercises: allExercises }),
      });
      if (!res.ok) {
        throw new Error('Failed to update workout');
      }

      const { workout } = await res.json();
      console.log('Updated workout:', workout);
      setWorkout(workout); // Set the updated workout
      setEditedExercises(workout.workout_exercises); // Update edited exercises state
      setIsEditing(false);
      setNewExercises([]); // Reset new exercises state
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleCancel = () => {
    setEditedExercises(workout.workout_exercises);
    setIsEditing(false);
    setNewExercises([]); // Reset new exercises state
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/workouts/delete/${id}`, {
        method: 'DELETE',
      });
      // --> Redirect to the workouts page <--
      if (res.ok) {
        router.push('/home/workouts');
      } else {
        throw new Error('Failed to delete workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...editedExercises];
    if (field === 'name' || field === 'muscularGroup') {
      updatedExercises[index].exercises[field] = value;
    } else {
      updatedExercises[index][field] = value;
    }
    setEditedExercises(updatedExercises);
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = editedExercises.filter((_, i) => i !== index);
    setEditedExercises(updatedExercises);
  };

  const handleAddExercise = () => {
    setNewExercises((prev) => [
      ...prev,
      {
        id: null,
        exercises: { name: '', muscularGroup: '' },
        sets: null,
        reps: null,
        lastWeightUsed: null,
        duration: null,
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

  const toggleWeightUnit = () => {
    setIsWeightInKg(!isWeightInKg);
  };

  const kgToLb = (kg: number) => (kg * 2.20462).toFixed(2);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{workout.name}</h1>
      <p className="text-lg text-gray-300 mb-16">{workout.description}</p>

      {/* Render the list of exercises for the workout */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 my-2">
          <thead className="bg-gray-50">
            <tr>
              {isEditing && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
                ></th>
              )}

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
                Last Weight Used ({isWeightInKg ? 'kg' : 'lb'})
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-black bg-gray-300 uppercase tracking-wider"
              >
                Duration (sec)
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-300">
            {editedExercises.map((exercise, index) => (
              <tr key={exercise.id}>
                {isEditing && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveExercise(index)}
                      className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                      <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                        <Minus className="h-4 w-4" />
                      </div>
                    </button>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {isEditing ? (
                    <input
                      type="text"
                      value={exercise.exercises.name ?? ''}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    exercise.exercises.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {isEditing ? (
                    <input
                      type="text"
                      value={exercise.exercises.muscularGroup ?? ''}
                      onChange={(e) => handleExerciseChange(index, 'muscularGroup', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    exercise.exercises.muscularGroup
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {isEditing ? (
                    <input
                      type="number"
                      value={exercise.sets ?? ''}
                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    exercise.sets
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {isEditing ? (
                    <input
                      type="number"
                      value={exercise.reps ?? ''}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    exercise.reps
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {isEditing ? (
                    <input
                      type="number"
                      value={isWeightInKg ? exercise.lastWeightUsed : kgToLb(exercise.lastWeightUsed)}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const newValue = isWeightInKg ? value : value / 2.20462; // Convert to kg before saving
                        handleExerciseChange(index, 'lastWeightUsed', newValue);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : isWeightInKg ? (
                    exercise.lastWeightUsed
                  ) : (
                    kgToLb(exercise.lastWeightUsed)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {isEditing ? (
                    <input
                      type="number"
                      value={exercise.duration ?? ''}
                      onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : exercise.duration !== null ? (
                    exercise.duration
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
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
                    value={isWeightInKg ? exercise.lastWeightUsed : (exercise.lastWeightUsed * 2.20462).toFixed(2)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const newValue = isWeightInKg ? value : value / 2.20462; // Convert to kg before saving
                      handleNewExerciseChange(index, 'lastWeightUsed', newValue);
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  <input
                    type="number"
                    value={exercise.duration}
                    onChange={(e) => handleNewExerciseChange(index, 'duration', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-4">
        {isEditing && (
          <button
            onClick={handleAddExercise}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Exercise
          </button>
        )}
        <button
          onClick={toggleWeightUnit}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-400 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          Show weight in {isWeightInKg ? 'lb' : 'kg'}
        </button>
      </div>

      <div className="flex justify-center space-x-20 mt-10">
        {isEditing ? (
          <>
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
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Edit Workout
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Workout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
