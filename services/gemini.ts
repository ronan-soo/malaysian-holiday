
import { GoogleGenAI } from "@google/genai";
import { LongHolidayProposal } from "../types";

export interface TravelPreferences {
  includeRedLight: boolean;
  travelPreference: 'Local' | 'Overseas' | 'Both';
}

export const getAiRecommendation = async (
  proposal: LongHolidayProposal, 
  prefs: TravelPreferences
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const locationInstruction = prefs.travelPreference === 'Local' 
    ? "Focus exclusively on destinations within Malaysia."
    : prefs.travelPreference === 'Overseas'
    ? "Focus exclusively on international destinations near Malaysia (e.g., Thailand, Vietnam, Indonesia, Singapore)."
    : "Provide a mix of local Malaysian and nearby international destinations.";

  const rldInstruction = prefs.includeRedLight 
    ? "The user is specifically interested in nightlife and areas known for adult entertainment/red-light districts (like parts of Bangkok, Pattaya, or specific nightlife hubs). Mention these areas if relevant to the recommended destinations."
    : "Focus on standard tourist attractions and hidden gems.";

  const prompt = `
    Based on this Malaysian long holiday proposal:
    Dates: ${proposal.startDate} to ${proposal.endDate} (${proposal.totalDays} days total)
    Public Holidays Included: ${proposal.breakdown.publicHolidays.map(h => h.name).join(', ')}
    Leave Days Required: ${proposal.leaveDaysRequired}

    ${locationInstruction}
    ${rldInstruction}

    Provide 3 travel destination recommendations. 
    For each, give a short reason why it's great for this specific duration and time of year.
    Keep the tone helpful and exciting. Format as markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return "Unable to load travel recommendations at this time.";
  }
};
