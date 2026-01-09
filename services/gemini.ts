
import { GoogleGenAI } from "@google/genai";
import { LongHolidayProposal } from "../types";

export const getAiRecommendation = async (proposal: LongHolidayProposal) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Based on this Malaysian long holiday proposal:
    Dates: ${proposal.startDate} to ${proposal.endDate} (${proposal.totalDays} days total)
    Public Holidays Included: ${proposal.breakdown.publicHolidays.map(h => h.name).join(', ')}
    Leave Days Required: ${proposal.leaveDaysRequired}

    Provide 3 travel destination recommendations within or near Malaysia (e.g., local road trip, short flight to neighboring country). 
    For each, give a short reason why it's great for this specific duration and time of year.
    Keep the tone helpful and exciting. Format as markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return "Unable to load travel recommendations at this time.";
  }
};
