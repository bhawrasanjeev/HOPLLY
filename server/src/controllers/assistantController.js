import { GoogleGenAI } from '@google/genai';

export const handleChat = async (req, res) => {
  try {
    const { prompt, message } = req.body;
    const userPrompt = prompt || message || '';

    if (!userPrompt.trim()) {
      return res.status(400).json({ error: 'Prompt message is required.' });
    }

    // Try Gemini AI SDK if API Key is configured
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `You are Hoplly AI Assistant, an expert AI helper for Hoplly (a hyperlocal community task app). Currency is always in Rs. Answer helpful, friendly, clear, and concise to: ${userPrompt}`,
          });

          if (response?.text) {
            return res.json({
              reply: response.text,
              sender: 'assistant',
              modelUsed: modelName,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
        } catch (aiErr) {
          console.warn(`[Gemini AI Model ${modelName} Warning]:`, aiErr.message);
          // Try next model candidate
        }
      }
    }

    // Smart Heuristics Fallback Engine (with currency in Rs.)
    let reply = "I'm here to help! Hoplly connects you directly with background-checked local neighbors. You can post a task or accept open jobs instantly in your feed.";
    const lower = userPrompt.toLowerCase();

    if (lower.includes('grocery')) {
      reply = "Great idea! I've pre-configured an optimal grocery delivery draft:\n- Recommended Budget: Rs. 25\n- Average Acceptance Time: 8 minutes\n- Category: Grocery\n\nWould you like to post this task now?";
    } else if (lower.includes('safety') || lower.includes('verify')) {
      reply = "Safety is Hoplly's top priority! All helpers undergo ID verification, local rating checks, and community reviews. Payments are safely held in escrow until you approve task completion.";
    } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('mow')) {
      reply = "Hoplly Hyperlocal Rate Standards:\n- Grocery Pickup: Rs. 20 - Rs. 30\n- Handyman Repairs: Rs. 45 - Rs. 75/hr\n- Dog Walking: Rs. 15 - Rs. 25 (30 mins)\n- Deep Cleaning: Rs. 70 - Rs. 120";
    }

    res.json({
      reply,
      sender: 'assistant',
      modelUsed: 'heuristics-engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
