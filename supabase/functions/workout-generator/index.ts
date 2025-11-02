import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { workoutType, currentMood, userProfile, heartRate } = await req.json();

    console.log('[Workout Generator] Generating workout plan...');

    const apiKey = Deno.env.get('GOOGLE_AI_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_KEY environment variable is not set');
    }

    const weightGoal = userProfile.goals.includes('Lose Weight')
      ? 'lose weight'
      : userProfile.goals.includes('Gain Weight')
      ? 'gain weight'
      : 'maintain weight';

    const bmiCategory = userProfile.bmi < 18.5
      ? 'underweight'
      : userProfile.bmi < 25
      ? 'normal weight'
      : userProfile.bmi < 30
      ? 'overweight'
      : 'obese';

    const intensityLevel = heartRate
      ? heartRate < 70
        ? 'high'
        : heartRate < 100
        ? 'medium'
        : 'low'
      : 'medium';

    // Calculate target weight change based on BMI and goals
    let targetWeightChange = '';
    if (weightGoal === 'lose weight') {
      const currentWeight = userProfile.weight;
      const targetBMI = 22; // Healthy BMI target
      const heightInMeters = userProfile.heightUnit === 'cm'
        ? userProfile.height / 100
        : userProfile.height * 0.0254;
      const targetWeight = targetBMI * (heightInMeters * heightInMeters);
      const weightToLose = userProfile.weightUnit === 'kg'
        ? Math.max(0, currentWeight - targetWeight)
        : Math.max(0, currentWeight - targetWeight * 2.20462);
      targetWeightChange = `Target weight to lose: ${weightToLose.toFixed(1)} ${userProfile.weightUnit}`;
    } else if (weightGoal === 'gain weight') {
      const currentWeight = userProfile.weight;
      const targetBMI = 22;
      const heightInMeters = userProfile.heightUnit === 'cm'
        ? userProfile.height / 100
        : userProfile.height * 0.0254;
      const targetWeight = targetBMI * (heightInMeters * heightInMeters);
      const weightToGain = userProfile.weightUnit === 'kg'
        ? Math.max(0, targetWeight - currentWeight)
        : Math.max(0, (targetWeight * 2.20462) - currentWeight);
      targetWeightChange = `Target weight to gain: ${weightToGain.toFixed(1)} ${userProfile.weightUnit}`;
    }

    const prompt = `Create a highly personalized workout plan based on these specific user details:

WORKOUT ENVIRONMENT: ${workoutType === 'home' ? 'HOME (bodyweight exercises only, no equipment)' : 'GYM (full access to equipment, machines, weights)'}

USER DETAILS:
- Current Mood: ${currentMood}
- Primary Goal: ${weightGoal.toUpperCase()}
- ${targetWeightChange}
- All Goals: ${userProfile.goals.join(', ')}
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} ${userProfile.weightUnit}
- Height: ${userProfile.height} ${userProfile.heightUnit}
- BMI: ${userProfile.bmi} (${bmiCategory})
- Activity Level: ${userProfile.lifestyle}
${heartRate ? `- Current Heart Rate: ${heartRate} BPM` : ''}
- Recommended Intensity: ${intensityLevel}

CRITICAL REQUIREMENTS:
1. Tailor exercises SPECIFICALLY for ${weightGoal}:
   ${weightGoal === 'lose weight' ? '- Focus on high-intensity cardio, HIIT, and fat-burning exercises\n   - Include compound movements to maximize calorie burn\n   - Emphasize exercises that create calorie deficit' : ''}
   ${weightGoal === 'gain weight' ? '- Focus on strength training and muscle building\n   - Include heavy compound lifts (if gym) or progressive bodyweight exercises (if home)\n   - Emphasize exercises that promote muscle hypertrophy' : ''}
   ${weightGoal === 'maintain weight' ? '- Balance cardio and strength training\n   - Focus on overall fitness and body composition\n   - Include variety to maintain engagement' : ''}

2. Match the ${intensityLevel} intensity level appropriate for their fitness
3. Consider their ${currentMood} mood when selecting exercise types
4. ${workoutType === 'home' ? 'Only include bodyweight exercises that can be done at home without equipment' : 'Include gym equipment like dumbbells, barbells, machines, cables'}
5. Account for ${bmiCategory} BMI category in exercise selection and intensity

Provide response in this EXACT JSON format:
{
  "type": "Descriptive workout name that reflects the goal",
  "description": "Brief description emphasizing how this workout helps achieve their ${weightGoal} goal",
  "exercises": [
    {"name": "exercise name", "sets": "3", "reps": "12-15 or time", "rest": "60s"}
  ],
  "duration": 45,
  "caloriesBurned": 350,
  "weeklyFrequency": "4-5 days/week",
  "music": ["genre1", "genre2", "genre3"],
  "tips": ["tip1 relevant to ${weightGoal}", "tip2", "tip3"]
}

IMPORTANT: The workout MUST be directly aligned with helping the user ${weightGoal}. Include 8-10 exercises minimum.`;

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Workout Generator] API error:', errorData);
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    result = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('[Workout Generator] Raw result:', result);

    let workoutPlan;
    try {
      workoutPlan = JSON.parse(result);
    } catch (parseError) {
      console.error('[Workout Generator] JSON parse error:', parseError);
      console.error('[Workout Generator] Failed to parse:', result);
      throw new Error('Failed to parse workout plan');
    }

    return new Response(
      JSON.stringify({
        ...workoutPlan,
        intensity: intensityLevel,
        heartRate,
        workoutType,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('[Workout Generator] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate workout plan' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});