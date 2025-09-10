/**
 * Shared type definitions for chat functionality
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ChatPersistenceHook {
  messages: Message[];
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  messageCount: number;
}

export interface ChatBotProps {
  messages: Message[];
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  updateLastMessage: (content: string) => void;
  messageCount: number;
}