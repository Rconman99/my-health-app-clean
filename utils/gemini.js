// utils/gemini.js
// Gemini AI Request Handler — securely connects to Google's Gemini API

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''; // Load from environment variable

export async function askGemini(promptText) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ parts: [{ text: promptText }] }],
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return answer || 'No response from Gemini.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Error connecting to Gemini.';
  }
}