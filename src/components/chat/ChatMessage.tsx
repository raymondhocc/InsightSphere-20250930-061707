import { Bot, User, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '@/hooks/useChatStore';
interface ChatMessageProps {
  message: Message;
}
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.id === 'streaming';
  const hasTools = !isUser && message.toolCalls && message.toolCalls.length > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex items-start gap-4', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border-2 border-indigo-100">
          <AvatarFallback className="bg-indigo-500 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-md lg:max-w-2xl rounded-2xl px-4 py-3 shadow-sm',
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
        )}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block ml-1 -mb-0.5 w-2 h-4 bg-slate-500 rounded-full"
            />
          )}
        </p>
        {hasTools && (
          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
            <Wrench className="h-3 w-3" />
            <span>Used tools to generate this response</span>
          </div>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-slate-200 text-slate-600">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}