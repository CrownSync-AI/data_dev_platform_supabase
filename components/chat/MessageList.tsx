'use client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
import { cn } from '@/lib/utils';
import { MessageRenderer } from './MessageRenderer';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pb-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex w-full",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 text-sm break-words",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <MessageRenderer message={message} />
          </div>
        </div>
      ))}
    </div>
  );
}