import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  Lightbulb, 
  User, 
  ShieldCheck, 
  BookmarkCheck,
  Scale
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESETS = [
  "How can I report a persistent pothole?",
  "Tell me about waste segregation rules in my ward",
  "How do I earn and redeem Civic Points?",
  "Tell me about the authorities in Emerald Ward"
];

export default function AICivicAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am ActiWard's AI Civic Assistant. I help you with local bylaws, safety rules, reporting guides, and ward-specific details.\n\nHere are topics you can ask me:\n- \"How can I report a persistent pothole?\"\n- \"Tell me about waste segregation rules in my ward\"\n- \"How do I earn and redeem Civic Points?\"\n- \"Tell me about the authorities in Emerald Ward\"",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append User Message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: data.message,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Chat failed');
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: "I am experiencing network connectivity lag. I will reload shortly.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="ai-assistant-panel">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          AI Civic Assistant <Sparkles className="h-6 w-6 text-emerald-800 animate-pulse" />
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Instant answers on local municipal bylaws, community waste rules, and council operations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[60vh]">
        
        {/* Chat Window Box */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 h-full flex flex-col overflow-hidden shadow-xs">
          {/* Chat header */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-emerald-800 text-white font-extrabold text-sm"><Sparkles className="h-4.5 w-4.5" /></span>
              <div>
                <p className="font-bold text-slate-800 text-xs">ActiWard AI Assistant</p>
                <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /><span className="text-[9px] text-slate-400 font-semibold uppercase">Always active</span></div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-extrabold uppercase">Emerald Ward Wiki</span>
          </div>

          {/* Messages viewport */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                  msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                }`}>
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>

                <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100/60'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center"><Sparkles className="h-4 w-4 text-emerald-800 animate-spin" /></div>
                <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100/60 text-slate-400 text-xs flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Form control */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="p-3 border-t border-slate-100 flex gap-2 shrink-0 bg-slate-50/50"
          >
            <input 
              type="text" 
              placeholder="Type any municipal or points inquiry..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white placeholder-slate-450 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 bg-slate-900 border border-slate-800 text-white hover:bg-slate-950 rounded-xl flex items-center justify-center cursor-pointer transition shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Suggestion Sidebar */}
        <div className="lg:col-span-4 space-y-4" id="ai-helper-sidebar">
          {/* Quick preset buttons */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5"><Lightbulb className="h-4 w-4 text-emerald-600" /> Presets to Ask</h4>
            <div className="space-y-2">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(preset)}
                  className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/20 text-xs text-slate-600/90 font-medium transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary resource links */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1"><Scale className="h-4 w-4 text-emerald-600" /> Statutory Resources</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5 hover:text-emerald-800 font-medium cursor-pointer">📜 Solid Waste Segregation Bylaw (PDF)</li>
              <li className="flex items-center gap-1.5 hover:text-emerald-800 font-medium cursor-pointer">🚧 Road Integrity Standards Sec 4-B</li>
              <li className="flex items-center gap-1.5 hover:text-emerald-800 font-medium cursor-pointer">🛡️ Ward Security and Lighting Codes</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
