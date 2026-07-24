import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Edit3, ShieldAlert, IndianRupee, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

interface AssistantPageProps {
  onNavigate: (tab: string) => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hi there!  Welcome to Hoply Assistant. Powered by Google Gemini AI. How can I help you with neighborhood tasks, rate estimates, or drafting details today?",
      timestamp: '10:42 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'I need someone to pick up groceries for me this afternoon. How does that work?',
      timestamp: '10:43 AM',
    },
    {
      id: 'm3',
      sender: 'assistant',
      text: "It's super easy! You can post a Grocery task in under a minute:\n\n1. Tap 'Post Task' below.\n2. Select 'Grocery' as the category.\n3. Add store location and budget estimate (typically Rs. 20 - Rs. 35 for local runs).\n4. A verified neighbor will accept and deliver directly to your door!",
      timestamp: '10:43 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { label: 'Draft Grocery Task', icon: Edit3, prompt: 'Help me draft a task for picking up weekly groceries from Whole Foods.' },
    { label: 'Safety & Verification', icon: ShieldAlert, prompt: 'How does Hoply verify local helpers and ensure safety?' },
    { label: 'Pricing Guide', icon: IndianRupee, prompt: 'What are the recommended hourly rates for lawn mowing and handyman tasks?' },
  ];

  const fetchAiResponse = async (userPrompt: string): Promise<string> => {
    // 1. Try server backend endpoint first
    try {
      const res = await fetch('http://localhost:5000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) return data.reply;
      }
    } catch (err) {
      // Backend server not running or network unreachable, fallthrough to client SDK
    }

    // 2. Direct client-side GoogleGenAI call with API key
    const apiKey =
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (import.meta as any).env?.GEMINI_API_KEY ||
      '';

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: `You are Hoply AI Assistant, an expert AI helper for Hoply (a hyperlocal community task app). Currency is always in Rs. Answer helpful, friendly, clear, and concise to: ${userPrompt}`,
            });
            if (response?.text) return response.text;
          } catch (mErr) {
            // try next model
          }
        }
      } catch (sdkErr) {
        console.warn('Client Gemini SDK error:', sdkErr);
      }
    }

    // 3. Smart Heuristics Fallback Engine
    const lower = userPrompt.toLowerCase();
    if (lower.includes('grocery')) {
      return "Great idea! I've pre-configured an optimal grocery delivery draft:\n- Recommended Budget: Rs. 25\n- Average Acceptance Time: 8 minutes\n- Category: Grocery\n\nWould you like to post this task now?";
    } else if (lower.includes('safety') || lower.includes('verify')) {
      return "Safety is Hoply's top priority! All helpers undergo ID verification, local rating checks, and community reviews. Payments are safely held in escrow until you approve task completion.";
    } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('mow')) {
      return "Hoply Hyperlocal Rate Standards:\n- Grocery Pickup: Rs. 20 - Rs. 30\n- Handyman Repairs: Rs. 45 - Rs. 75/hr\n- Dog Walking: Rs. 15 - Rs. 25 (30 mins)\n- Deep Cleaning: Rs. 70 - Rs. 120";
    }

    return "I'm here to help! Hoply connects you directly with background-checked local neighbors. You can post a task or accept open jobs instantly in your feed.";
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const botReply = await fetchAiResponse(query);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "I'm here to help! Hoply connects you directly with background-checked local neighbors.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="page-container" style={{ paddingBottom: '96px' }}>
      <div className="chat-window">
        {/* Header */}
        <div className="chat-header">
          <div className="flex-row gap-3 flex-1">
            <div className="chat-avatar assistant">
              <Sparkles style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h2 className="h3-title" style={{ fontSize: '0.95rem' }}>
                Hoply AI Assistant
              </h2>
              <p className="text-xs text-muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                Powered by Gemini AI • Always active for neighborhood help
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('post')}
            className="btn btn-primary btn-sm flex-row gap-1"
          >
            <span>Post Task</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {/* Message Chat Container */}
        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`chat-bubble-wrap ${m.sender === 'user' ? 'user' : 'assistant'}`}
            >
              <div className={`chat-avatar ${m.sender === 'user' ? 'user' : 'assistant'}`}>
                {m.sender === 'user' ? <User style={{ width: '14px', height: '14px' }} /> : <Bot style={{ width: '14px', height: '14px' }} />}
              </div>

              <div className="chat-bubble">
                {m.text}
                <div className="chat-time">
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex-row gap-2 text-xs text-muted" style={{ padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', width: 'fit-content' }}>
              <Sparkles className="animate-spin" style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
              <span>Hoply AI is typing...</span>
            </div>
          )}
        </div>

        {/* Input & Quick Action Bar */}
        <div className="chat-footer">
          {/* Quick Prompts Row */}
          <div className="quick-prompts">
            {quickPrompts.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.prompt)}
                  className="quick-prompt-btn"
                >
                  <Icon style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Text Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chat-input-wrap"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question or ask AI to draft a task..."
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="chat-send-btn"
            >
              <Send style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
