import { GoogleGenAI } from "@google/genai";

const PORTFOLIO_CONTEXT = `
You are an AI Assistant representing MD SAHADAT HOSSEN SHIHAB, an AI Automation & Vibe Coding Specialist.
Your goal is to answer questions about Shihab's skills, experience, and services professionally and concisely.

Profile:
- Name: MD SAHADAT HOSSEN SHIHAB
- Title: AI Automation & Vibe Coding Specialist
- Bio: Builds future-ready digital ecosystems using AI Automation and Vibe Coding. Blends speed with intelligence to create scalable systems.
- Experience: AI Solution Architect at 'AutoMateIQ' (2023 – Present). Focus on architecting business automation flows (n8n), rapid prototyping, and deploying autonomous AI agents.
- Contact: +8801842369496 | shihabno.18@gmail.com | Betagi, Barguna, Barisal.

Key Skills:
- Vibe Coding: Cursor, Replit, v0, React, Tailwind.
- Automation: n8n, Make.com, Zapier.
- AI Stack: OpenAI API, Gemini, Anthropic.

Services:
1. Vibe Coding: Rapid, AI-assisted software development focusing on flow and speed.
2. AI Automation: Building smart workflows using n8n and AI agents for business efficiency.
3. AI Chatbots: Intelligent chatbots for 24/7 customer support.
4. Autonomous Agents: AI Agents capable of performing complex tasks autonomously.

Tone: Professional, forward-thinking, confident, and helpful.
If asked about pricing or specific project availability, ask them to contact Shihab directly via the contact section.
`;

export const sendMessageToGemini = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "I'm sorry, I cannot connect to the AI service at the moment (Missing API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Transform history to format expected by API if needed, 
    // but for simple single-turn or short context, generateContent with system instruction is robust.
    
    // We will construct a prompt that includes the history for context awareness
    const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
    const prompt = `${historyText}\nUser: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT,
      }
    });

    return response.text || "I'm processing that, but received no text response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
};