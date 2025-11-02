import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { ingredients, userProfile, mood, cuisine } = await req.json();

    console.log('[Meal Plan Generator] Generating meal plan...');

    const apiKey = Deno.env.get('GOOGLE_AI_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_KEY environment variable is not set');
    }

    const maxCaloriesPerMeal = userProfile.dailyCalorieLimit ? Math.floor(userProfile.dailyCalorieLimit / 3) : 600;

    const prompt = `You are a professional nutritionist and chef. Generate a detailed meal plan based on:

Available Ingredients: ${ingredients}
Cuisine Type: ${cuisine || 'Any'}
User Region: ${userProfile.region}
User Goals: ${userProfile.goals.join(', ')}
Mood: ${mood}
Maximum Calories: ${maxCaloriesPerMeal} kcal

IMPORTANT RULES:
1. ONLY use ingredients from the available list
2. If ingredients are insufficient, respond with: {"missingIngredients": ["ingredient1", "ingredient2"]}
3. Consider the user's mood when suggesting meals (e.g., comfort food for stressed, energizing for tired)
4. Respect the regional cuisine preferences
5. Stay within the calorie limit
6. In the recipe field, use only plain text without special characters or line breaks. Use periods to separate steps.

Provide response in this EXACT JSON format (ensure all strings are properly escaped):
{
  "meal": {
    "name": "Meal name",
    "calories": 450,
    "ingredients": [
      {"name": "ingredient", "amount": "100g", "calories": 120}
    ],
    "recipe": "Step 1. Do this. Step 2. Do that. Step 3. Finish cooking.",
    "cuisine": "${cuisine}",
    "mood": "${mood}",
    "videoUrl": ""
  }
}

OR if ingredients insufficient:
{
  "missingIngredients": ["ingredient1", "ingredient2"]
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no newlines in strings.`;

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Meal Plan Generator] API error:', data);
      return new Response(
        JSON.stringify({ error: data.error?.message || 'API request failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    result = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('[Meal Plan Generator] Raw result:', result);

    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      console.error('[Meal Plan Generator] JSON parse error:', parseError);
      console.error('[Meal Plan Generator] Failed to parse:', result);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(parsedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Meal Plan Generator] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});