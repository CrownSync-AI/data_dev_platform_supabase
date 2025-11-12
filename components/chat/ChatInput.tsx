'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
      <Input
        value={input}
        placeholder="Ask about your data, upload documents, or get help..."
        onChange={handleInputChange}
        disabled={isLoading}
        className="flex-1 h-11 px-4 text-sm border-input bg-background hover:bg-accent/5 focus:bg-background transition-colors"
        autoFocus
      />
      <Button 
        type="submit" 
        disabled={isLoading || !input?.trim()} 
        size="icon"
        className="h-11 w-11 shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}