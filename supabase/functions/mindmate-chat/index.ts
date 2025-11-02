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
    const { message } = await req.json();

    console.log('[MindMate Edge Function] Received message:', message);

    const apiKey = Deno.env.get('GOOGLE_AI_KEY');
    console.log('[MindMate Edge Function] API Key exists:', !!apiKey);

    if (!apiKey) {
      throw new Error('GOOGLE_AI_KEY environment variable is not set');
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are MindMate, an empathetic AI wellness and fitness coach. You help users manage stress, stay motivated, and follow personalized workout plans.\n\nUser: ${message}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    console.log('[MindMate Edge Function] Calling Google AI API...');

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[MindMate Edge Function] Response status:', response.status);

    const data = await response.json();
    console.log('[MindMate Edge Function] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[MindMate Edge Function] API error:', data);
      return new Response(
        JSON.stringify({ 
          error: data.error?.message || 'API request failed',
          details: data 
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
    console.log('[MindMate Edge Function] Extracted result:', result);

    return new Response(
      JSON.stringify({ response: result }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[MindMate Edge Function] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});