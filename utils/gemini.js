export async function askGemini(promptText) {
  const apiKey = 'REDACTED_GEMINI_KEY_2';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: promptText }] }],
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini error:', err);
    return 'Error connecting to Gemini.';
  }
}