export async function generateMealPlan(
  ingredients: string,
  userProfile: any,
  mood: string,
  cuisine: string
): Promise<any> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meal-plan-generator`;

  console.log('[Meal Plan API] Starting request...');
  console.log('[Meal Plan API] Ingredients:', ingredients);
  console.log('[Meal Plan API] User profile:', userProfile);
  console.log('[Meal Plan API] Mood:', mood);
  console.log('[Meal Plan API] Cuisine:', cuisine);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ingredients,
        userProfile,
        mood,
        cuisine,
      }),
    });

    console.log('[Meal Plan API] Response status:', response.status);

    const data = await response.json();
    console.log('[Meal Plan API] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Meal Plan API] API returned error:', data);
      return {
        error: data.error || 'Unknown error occurred',
      };
    }

    return data;
  } catch (error) {
    console.error('[Meal Plan API] Exception caught:', error);
    return {
      error: 'Sorry, something went wrong. Check console for details.',
    };
  }
}

export async function sendToMealPlanChat(message: string, userProfile: any): Promise<string> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meal-plan-chat`;

  console.log('[Meal Plan Chat API] Starting request...');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ message, userProfile }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Meal Plan Chat API] API returned error:', data);
      return `API Error: ${data.error || 'Unknown error occurred'}`;
    }

    return data.response || 'No response received.';
  } catch (error) {
    console.error('[Meal Plan Chat API] Exception caught:', error);
    return 'Sorry, something went wrong.';
  }
}
