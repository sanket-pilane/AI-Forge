import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generates a short, descriptive title for a user's prompt.
 * Enforces a 50-character limit.
 */
export async function generateTitle(prompt: string): Promise<string | null> {
  const titlePrompt = `
    You are a title generation expert. Create a short, catchy, and descriptive 
    title (max 50 characters) for the following user prompt.
    Respond with ONLY the title and nothing else.
    
    PROMPT: "${prompt}"
  `;

  try {
    const result = await model.generateContent(titlePrompt);
    const title = result.response.text().trim().replace(/"/g, ""); // Clean up quotes

    // Enforce max length
    if (title.length > 50) {
      return title.substring(0, 50) + "...";
    }
    return title;
  } catch (error) {
    console.error("Title generation failed:", error);
    return null; // Return null on failure
  }
}
