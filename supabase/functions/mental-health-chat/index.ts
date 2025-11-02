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
    const { message, mood } = await req.json();

    const apiKey = Deno.env.get('GOOGLE_AI_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_AI_KEY environment variable is not set');
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    let systemPrompt = `You're a caring friend. Keep responses SUPER SHORT and supportive!

STRICT RULES:
- Maximum 2-3 sentences ONLY
- Be warm but brief
- Validate their feelings quickly
- Give 1 simple tip
- NO long explanations
- Like texting a supportive friend`;
    
    if (mood === 'Stressed' || mood === 'Tired') {
      systemPrompt += `\n\n💙 User is ${mood}. Extra gentle and calming.`;
    }
    
    systemPrompt += `\n\nUser's mood: ${mood}\nUser: ${message}`;

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.95,
          maxOutputTokens: 100,
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

    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here for you 💙';
    
    const sentences = result.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 3) {
      result = sentences.slice(0, 3).join('. ') + '.';
    }

    return new Response(
      JSON.stringify({ response: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Mental Health Chat] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});