export async function sendToMentalHealthAI(message: string, mood: string): Promise<string> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-chat`;

  console.log('[Mental Health API] Starting request...');
  console.log('[Mental Health API] Edge Function URL:', apiUrl);
  console.log('[Mental Health API] User message:', message);
  console.log('[Mental Health API] Current mood:', mood);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ message, mood }),
    });

    console.log('[Mental Health API] Response status:', response.status);

    const data = await response.json();
    console.log('[Mental Health API] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('[Mental Health API] API returned error:', data);
      return `API Error: ${data.error || 'Unknown error occurred'}`;
    }

    return data.response || 'No response received.';
  } catch (error) {
    console.error('[Mental Health API] Exception caught:', error);
    return 'Sorry, something went wrong. Check console for details.';
  }
}
