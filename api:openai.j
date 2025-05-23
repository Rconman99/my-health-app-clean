import { OPENAI_API_KEY } from '@env';

export async function askOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || 'No suggestions returned.';
}