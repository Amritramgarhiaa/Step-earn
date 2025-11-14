
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is set in the environment.
// In a real app, this would be handled securely on a backend.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Fitness tip feature will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getFitnessTip = async (): Promise<string> => {
  if (!API_KEY) {
    return "The fitness tip generator is currently unavailable. Please configure your API key.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give me a short, actionable, and encouraging fitness or health tip for someone who tracks their steps. Keep it under 200 characters.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching fitness tip from Gemini API:", error);
    return "Could not fetch a fitness tip at this time. Please try again later.";
  }
};
