import React, { useEffect, useRef } from 'react';
import { Send, CornerDownLeft, Bot, LoaderCircle } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
const suggestions = [
  "Show me last month's KPIs",
  "What was our user acquisition last month?",
  "Display the sales funnel",
  "Analyze customer segments",
];
export function ChatView() {
  const messages = useChatStore((state) => state.messages);
  const input = useChatStore((state) => state.input);
  const setInput = useChatStore((state) => state.setInput);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const streamingMessage = useChatStore((state) => state.streamingMessage);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, streamingMessage]);
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage();
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    sendMessage(suggestion);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-lg border border-slate-200">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-6 space-y-6">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 pt-20">
              <Bot className="h-12 w-12 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-800">Welcome to InsightSphere</h2>
              <p className="max-w-md mt-2">
                Ask me anything about your CRM data. Try one of the suggestions below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="cursor-pointer py-2 px-3 text-sm border-slate-300 hover:bg-slate-100 transition-colors"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          )}
          {isStreaming && (
            <ChatMessage
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingMessage,
                timestamp: Date.now(),
              }}
            />
          )}
          {isLoading && messages.length === 0 && (
             <div className="flex justify-center pt-20">
                <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about customers, funnels, or KPIs..."
            className="w-full pr-24 py-3 pl-4 text-base resize-none border-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {isLoading && !isStreaming && <LoaderCircle className="h-5 w-5 animate-spin text-slate-400" />}
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full w-10 h-10">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press <CornerDownLeft className="inline-block h-3 w-3" /> to send. Shift + <CornerDownLeft className="inline-block h-3 w-3" /> for a new line.
        </p>
      </div>
    </div>
  );
}