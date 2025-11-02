interface WorkoutParams {
  workoutType: 'home' | 'gym';
  currentMood: string;
  userProfile: {
    goals: string[];
    age: number | null;
    sex: string;
    weight: number | null;
    weightUnit: string;
    height: number | null;
    heightUnit: string;
    bmi: number | null;
    lifestyle: string;
  };
  heartRate?: number;
}

export async function generateWorkoutPlan(params: WorkoutParams) {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workout-generator`;

  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to generate workout plan');
  }

  return response.json();
}
