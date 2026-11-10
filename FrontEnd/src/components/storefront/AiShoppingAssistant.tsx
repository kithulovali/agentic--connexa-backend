import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  Cpu,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { AgentResponse, ProductOut } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  dataSummary?: Record<string, any>;
  recommendations?: ProductOut[];
  timestamp: Date;
}

interface AiShoppingAssistantProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiShoppingAssistant: React.FC<AiShoppingAssistantProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I'm your Urban Scenery AI Shopping Assistant. Ask me anything about our electronics catalogue, budget recommendations, or hardware specifications!",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle external initial prompt
  useEffect(() => {
    if (initialPrompt) {
      setIsOpen(true);
      setIsMinimized(false);
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send question to customer shopping assistant
      const response: AgentResponse = await api.askCustomerShoppingAssistant(promptText);

      // Check if user is asking for recommendations to enrich response
      let recs: ProductOut[] | undefined = undefined;
      if (
        promptText.toLowerCase().includes('recommend') ||
        promptText.toLowerCase().includes('best') ||
        promptText.toLowerCase().includes('budget')
      ) {
        try {
          const recRes = await api.getAiRecommendations({ query: promptText });
          if (recRes && recRes.recommendations?.length > 0) {
            recs = recRes.recommendations.slice(0, 3);
          }
        } catch {
          // Non-blocking fallback
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.answer,
        dataSummary: response.data_summary,
        recommendations: recs,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI assistant error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text:
          err.message ||
          'I am having trouble reaching our electronics database right now. Please try again shortly.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const starterChips = [
    'Recommend a laptop under $1000',
    'Which headphones have the best audio quality?',
    'Show me smartphones in stock',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-sky-500/30 hover:scale-105 transition-all ai-glow"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="leading-tight">AI Assistant</div>
            <div className="text-[10px] text-sky-200 font-normal font-mono">Catalogue Grounded</div>
          </div>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className={`w-[92vw] sm:w-[420px] rounded-3xl glass-dropdown border border-sky-500/30 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Shopping Assistant</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Grounded Database AI</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize assistant window" : "Minimize assistant window"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant window"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Attached Product Recommendations */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                          <p className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
                            Recommended Matches:
                          </p>
                          {msg.recommendations.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-2"
                            >
                              <div className="truncate min-w-0">
                                <div className="font-semibold text-white truncate text-[11px]">
                                  {item.name}
                                </div>
                                <div className="text-[10px] font-mono text-sky-400">
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                              <button
                                onClick={() => addItem(item, 1)}
                                className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[10px] font-bold flex items-center gap-1 flex-shrink-0"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="rounded-2xl p-3 bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                      <span className="text-[11px] font-mono">Consulting catalogue database...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Starter Chips */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 border-t border-slate-800/60 flex flex-wrap gap-1.5 bg-slate-950/40">
                  {starterChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-white hover:border-slate-700 transition-all text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 border-t border-slate-800 bg-slate-900/70 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about specs, budget, or stock..."
                  disabled={loading}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-sky-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

