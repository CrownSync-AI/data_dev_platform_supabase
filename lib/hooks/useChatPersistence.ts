import { useState, useEffect, useCallback } from 'react';
import { Message, ChatPersistenceHook } from '@/lib/types/chat';

const CHAT_STORAGE_KEY = 'crownsync_chat_messages';
const MAX_MESSAGES = 100; // Keep last 100 messages to prevent memory issues

export function useChatPersistence() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI data assistant. I can help you with:\n\n• **Document Q&A**: Upload documents and ask questions about their content\n• **Database Insights**: Query your campaign data, retailer performance, and analytics\n• **Platform Support**: Get help with using the CrownSync platform\n\nWhat would you like to explore today?',
      timestamp: Date.now()
    }
  ]);

  // Load messages from sessionStorage on component mount
  useEffect(() => {
    const loadMessages = () => {
      try {
        const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
        if (stored) {
          const parsedMessages = JSON.parse(stored);
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages);
          }
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
        // If there's an error, clear the corrupted data
        sessionStorage.removeItem(CHAT_STORAGE_KEY);
      }
    };

    loadMessages();
  }, []);

  // Save messages to sessionStorage whenever messages change
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }, [messages]);

  const addMessage = useCallback((message: Omit<Message, 'timestamp'>) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: Date.now()
    };

    setMessages(prev => {
      const newMessages = [...prev, messageWithTimestamp];
      
      // Keep only the most recent messages if we exceed the limit
      if (newMessages.length > MAX_MESSAGES) {
        return newMessages.slice(-MAX_MESSAGES);
      }
      
      return newMessages;
    });
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = content;
      }
      return newMessages;
    });
  }, []);

  const clearMessages = useCallback(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI data assistant. I can help you with:\n\n• **Document Q&A**: Upload documents and ask questions about their content\n• **Database Insights**: Query your campaign data, retailer performance, and analytics\n• **Platform Support**: Get help with using the CrownSync platform\n\nWhat would you like to explore today?',
      timestamp: Date.now()
    };
    
    setMessages([welcomeMessage]);
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  return {
    messages,
    addMessage,
    updateLastMessage,
    clearMessages,
    messageCount: messages.length
  } as ChatPersistenceHook;
}