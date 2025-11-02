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
    const { message, userProfile } = await req.json();

    const apiKey = Deno.env.get('GOOGLE_AI_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_KEY environment variable is not set');
    }

    const systemPrompt = `You're a friendly nutritionist. Keep it SUPER SHORT and casual!

STRICT RULES:
- Maximum 3-4 sentences ONLY
- Use simple, everyday language
- Give 1-2 quick tips
- Be encouraging but brief
- NO long lists or paragraphs
- Talk like you're texting a friend

User Info:
- Goals: ${userProfile.goals.join(', ')}
- Daily Calories: ${userProfile.dailyCalorieLimit} kcal
- From: ${userProfile.region}

User: ${message}`;

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { 
          temperature: 0.9, 
          maxOutputTokens: 150,
          topP: 0.95,
          topK: 40
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || 'API request failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Happy to help!';
    
    const sentences = result.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 4) {
      result = sentences.slice(0, 4).join('. ') + '.';
    }

    return new Response(
      JSON.stringify({ response: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Meal Plan Chat] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});