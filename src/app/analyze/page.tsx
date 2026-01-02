'use client';

import { useChat } from '@ai-sdk/react';
import { type UIMessage as Message } from 'ai';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Simplified ScrollArea if not available in components
const ChatScrollArea = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`overflow-y-auto px-4 py-6 flex flex-col gap-6 ${className}`}>{children}</div>
);

function getMessageText(message: Message): string {
  return message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('');
}

export default function AnalyzePage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    onError: (err: Error) => {
      toast.error('Failed to send message. Please try again.');
      console.error(err);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input;
    setInput('');
    sendMessage({ text });
  };

  const suggestions = [
    { icon: <TrendingUp className="w-4 h-4" />, text: 'Analyze my portfolio growth' },
    { icon: <Wallet className="w-4 h-4" />, text: 'How much can I safely withdraw?' },
    { icon: <ShieldCheck className="w-4 h-4" />, text: 'Am I on track for FI?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground mt-1">
            Ask questions about your portfolio and get AI-powered insights.
          </p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 border-none bg-slate-50/50 backdrop-blur-sm shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />

        <ChatScrollArea className="flex-1">
          <div className="flex flex-col gap-6 min-h-full pb-20 mt-auto">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-20"
              >
                <div className="p-4 rounded-2xl bg-white shadow-xl">
                  <Bot className="w-12 h-12 text-sky-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Welcome to Analyze</h2>
                  <p className="text-muted-foreground max-w-sm">
                    I can help you understand your net worth, retirement goals, and investment
                    distribution.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-4">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion.text)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left text-sm group"
                    >
                      <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-sky-50 transition-colors">
                        {suggestion.icon}
                      </div>
                      <span className="font-medium text-slate-700">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m: Message) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`mt-1 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 shadow-sm'
                      }`}
                    >
                      {m.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-sky-500" />
                      )}
                    </div>
                    <div
                      className={`rounded-3xl px-5 py-3 shadow-sm ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 rounded-tl-none prose prose-slate max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100'
                      }`}
                    >
                      {m.role === 'user' ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {getMessageText(m)}
                        </p>
                      ) : (
                        <div className="text-sm">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {getMessageText(m)}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[85%]">
                  <div className="mt-1 p-2 rounded-full h-8 w-8 flex items-center justify-center bg-white border border-slate-200 shadow-sm animate-pulse">
                    <Bot className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none px-5 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ChatScrollArea>

        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
            <Input
              className="w-full pr-14 py-6 rounded-2xl border-slate-200 focus-visible:ring-sky-500 shadow-sm text-base"
              value={input}
              placeholder="Ask about your financial future..."
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1.5 h-9 w-9 p-0 rounded-xl bg-sky-600 hover:bg-sky-700 transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-medium">
            AI can make mistakes. Verify important financial decisions.
          </p>
        </div>
      </Card>
    </div>
  );
}
