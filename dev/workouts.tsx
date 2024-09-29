import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';

export default function Component() {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: 'Leg Day Routine',
      exercises: [
        { name: 'Squat', sets: 4, reps: 12 },
        { name: 'Leg Press', sets: 4, reps: 10 },
        { name: 'Lunges', sets: 3, reps: 15 },
      ],
    },
    {
      id: 2,
      name: 'Upper Body Strength',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10 },
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Shoulder Press', sets: 4, reps: 12 },
      ],
    },
  ]);

  const handleCreateWorkout = () => {
    // Logic to create a new workout can go here
  };

  return (
    <div className="workouts-page">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Your Workouts</h2>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {workouts.map((workout) => (
              <div key={workout.id} className="workout-item mb-4">
                <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                <Separator className="my-2" />
                <ul className="list-disc list-inside mb-2">
                  {workout.exercises.map((exercise, index) => (
                    <li key={index} className="mb-1">
                      {exercise.name} - {exercise.sets} sets of {exercise.reps} reps
                    </li>
                  ))}
                </ul>
                <Button className="view-workout-btn mb-2" variant="secondary">
                  View Full Workout
                </Button>
                <Separator className="my-2" />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateWorkout} className="create-workout-btn w-full" variant="default">
            <PlusIcon className="mr-2 h-4 w-4" /> Create New Workout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}