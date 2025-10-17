'use client';

import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { useState, useEffect, useRef } from 'react';
import { Message, ChatBotProps } from '@/lib/types/chat';

interface ExtendedChatBotProps extends ChatBotProps {
  isEmbeddedMode?: boolean;
}

export function ChatBot({ messages, addMessage, updateLastMessage, messageCount, isEmbeddedMode = false }: ExtendedChatBotProps) {
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hide quick actions if we have more than just the welcome message
  useEffect(() => {
    setShowQuickActions(messageCount <= 1);
  }, [messageCount]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
      
      // Only auto-scroll if user is near the bottom or if it's a new message
      if (isNearBottom || messages.length > 0) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    };

    addMessage(userMsg);
    setIsLoading(true);
    setInput('');
    setShowQuickActions(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      };

      addMessage(assistantMsg);

      const decoder = new TextDecoder();
      let done = false;
      let fullContent = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          updateLastMessage(fullContent);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      addMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className={`${isEmbeddedMode ? '' : 'ml-20'} h-full flex flex-col`}>
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4"
        style={{ 
          maxHeight: 'calc(100vh - 180px)',
          minHeight: '400px'
        }}
      >
        {showQuickActions && (
          <QuickActions onActionClick={handleQuickAction} />
        )}
        <MessageList messages={messages} />
        <div ref={messagesEndRef} className="h-4" />
      </div>
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <ChatInput 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}