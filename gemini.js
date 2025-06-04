// utils/gemini.js
import { GEMINI_API_KEY } from '@env';

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export async function askGemini(promptText, retryCount = 2) {
  const body = {
    contents: [{ parts: [{ text: promptText }] }],
  };

  for (let attempt = 1; attempt <= retryCount + 1; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

      return text || 'No meaningful response from Gemini.';
    } catch (err) {
      console.warn(`Gemini attempt ${attempt} failed:`, err.message);
      if (attempt === retryCount + 1) {
        return 'Gemini failed after multiple attempts. Please try again later.';
      }
    }
  }
}