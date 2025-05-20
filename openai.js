export async function getAIPersonalPlan(profile, goals) {
    const prompt = `
  Create a personalized health optimization and fitness strategy based on the following user profile:
  
  Name: ${profile.name}
  Age: ${profile.age}
  Height: ${profile.height}" (in inches)
  Weight: ${profile.weight} lbs
  Fitness Level: ${profile.fitnessLevel}
  Goals: ${goals.join(', ')}
  
  Include:
  - Workout split recommendation
  - Nutrition or supplements
  - Recovery tools (e.g. red light, cold plunge)
  - Hormone/peptide optimization ideas (for research only)
  - Encouragement quote
  `;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer REDACTED_OPENAI_KEY",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      });
  
      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || "No suggestions returned.";
    } catch (err) {
      console.error("GPT error:", err);
      return "Error generating suggestions.";
    }
  }
