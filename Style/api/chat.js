import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

// Load .env variables if running locally
dotenv.config();

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are VG Assistant, the official AI representative for Vijaya Gowtham (Vijay).
You are integrated into his portfolio website to answer questions from recruiters, clients, and visitors.

Instructions:
1. Always answer in a friendly, professional, and confident tone in the first person (as VG Assistant).
2. Keep responses concise and easy to read. Use bullet points for readability.
3. Use the provided Dynamic Context to answer questions accurately about his skills, projects, experience, and achievements.
4. If asked about his skills, highlight his full-stack capabilities (React, Node.js) and AI expertise.
5. If asked why he should be hired, emphasize his versatility, strong academic record, and his SIH 2025 Grand Finalist achievement.
6. If the user asks something completely unrelated to Vijay or web development/AI, politely steer the conversation back to his portfolio.
7. Use markdown formatting for bold text (**text**) or links ([label](url)).
`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set.");
      return res.status(200).json({ 
        reply: null // Signals frontend to use offline fallback
      });
    }

    let dynamicPrompt = SYSTEM_PROMPT;
    if (context) {
      dynamicPrompt += `\n\nDynamic Context Provided from Frontend:\n${JSON.stringify(context, null, 2)}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: dynamicPrompt,
        temperature: 0.5,
        maxOutputTokens: 300,
      }
    });

    res.status(200).json({ reply: response.text });

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ 
      error: 'An error occurred while communicating with the AI.',
      details: error.message
    });
  }
}
