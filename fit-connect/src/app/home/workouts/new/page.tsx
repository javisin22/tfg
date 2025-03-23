'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Minus, Plus, ChevronRight } from 'lucide-react';
import Loading from '../../../../components/Loading';

export default function CreateWorkoutPage() {
  const router = useRouter();

  const [workout, setWorkout] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [newExercises, setNewExercises] = useState([]);
  const [isWeightInKg, setIsWeightInKg] = useState(true);
  const [showDetails, setShowDetails] = useState({});

  const handleSave = async () => {
    setLoading(true);

    // API call to create the new workout
    try {
      const res = await fetch('/api/user/workouts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workout, workout_exercises: newExercises }),
      });
      if (!res.ok) {
        throw new Error('Failed to create workout');
      }

      const { workout: newWorkout } = await res.json();
      setLoading(false);

      // Redirect to the new workout page
      router.push(`/home/workouts/${newWorkout.id}`);
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
    const newExercise = {
      id: null,
      exercises: { name: '', muscularGroup: '' },
      sets: 0,
      reps: 0,
      lastWeightUsed: 0, // Stored in kg
      duration: 0,
    };

    setNewExercises((prev) => [...prev, newExercise]);

    // Add entry to showDetails for the new exercise
    setShowDetails((prev) => ({
      ...prev,
      [newExercises.length]: true, // Automatically show details for new exercise cards
    }));
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

    // Update showDetails state
    const newShowDetails = {};
    Object.keys(showDetails).forEach((key) => {
      const keyNum = parseInt(key);
      if (keyNum < index) {
        newShowDetails[keyNum] = showDetails[keyNum];
      } else if (keyNum > index) {
        newShowDetails[keyNum - 1] = showDetails[keyNum];
      }
    });
    setShowDetails(newShowDetails);
  };

  const toggleWeightUnit = () => {
    setIsWeightInKg(!isWeightInKg);
  };

  const toggleDetails = (index) => {
    setShowDetails({
      ...showDetails,
      [index]: !showDetails[index],
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 h-[calc(100vh-120px)] overflow-y-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Create New Workout</h1>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-white">Workout Name</label>
        <input
          type="text"
          value={workout.name}
          onChange={(e) => handleWorkoutChange('name', e.target.value)}
          className="mt-1 block w-full px-2 py-1.5 sm:px-3 sm:py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
        />
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-white">Description</label>
        <textarea
          value={workout.description}
          onChange={(e) => handleWorkoutChange('description', e.target.value)}
          className="mt-1 block w-full px-2 py-1.5 sm:px-3 sm:py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          rows={3}
        />
      </div>

      {/* Mobile Card View - Only visible on small screens */}
      <div className="md:hidden space-y-3">
        {newExercises.map((exercise, index) => (
          <div key={`mobile-${index}`} className="bg-white rounded-lg shadow-md p-3 text-black">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Exercise name"
                value={exercise.exercises.name}
                onChange={(e) => handleNewExerciseChange(index, 'name', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
              <div className="flex items-center">
                <button onClick={() => toggleDetails(index)} className="text-gray-500 mr-1">
                  <ChevronRight className={`h-4 w-4 transform ${showDetails[index] ? 'rotate-90' : ''} transition-transform`} />
                </button>
                <button onClick={() => handleRemoveNewExercise(index)} className="text-red-500 p-1">
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {showDetails[index] && (
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="font-medium">Muscle Group:</span>
                  <input
                    type="text"
                    value={exercise.exercises.muscularGroup}
                    onChange={(e) => handleNewExerciseChange(index, 'muscularGroup', e.target.value)}
                    className="w-1/2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="font-medium">Sets:</span>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => handleNewExerciseChange(index, 'sets', e.target.value)}
                    className="w-1/3 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="font-medium">Reps:</span>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleNewExerciseChange(index, 'reps', e.target.value)}
                    className="w-1/3 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="font-medium">Weight ({isWeightInKg ? 'kg' : 'lb'}):</span>
                  <input
                    type="number"
                    value={isWeightInKg ? exercise.lastWeightUsed : (exercise.lastWeightUsed * 2.20462).toFixed(2)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const newValue = isWeightInKg ? value : value / 2.20462;
                      handleNewExerciseChange(index, 'lastWeightUsed', newValue);
                    }}
                    className="w-1/3 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Duration (sec):</span>
                  <input
                    type="number"
                    value={exercise.duration}
                    onChange={(e) => handleNewExerciseChange(index, 'duration', e.target.value)}
                    className="w-1/3 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 my-2">
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
            {newExercises.map((exercise, index) => (
              <tr key={`desktop-${index}`}>
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
                      const newValue = isWeightInKg ? value : value / 2.20462;
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center mt-4 gap-2 sm:gap-4">
        <button
          onClick={handleAddExercise}
          className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm w-full sm:w-auto"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Add Exercise
        </button>
        <button
          onClick={toggleWeightUnit}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-400 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-xs sm:text-sm w-full sm:w-auto"
        >
          Show weight in {isWeightInKg ? 'lb' : 'kg'}
        </button>
      </div>

      {/* Save/Cancel buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-20 mt-6 sm:mt-10">
        <button
          onClick={handleSave}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-xs sm:text-sm w-full sm:w-auto"
        >
          Save Workout
        </button>
        <button
          onClick={handleCancel}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-xs sm:text-sm w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
