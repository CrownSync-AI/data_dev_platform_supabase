'use client';

import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { useState, useEffect } from 'react';
import { Message, ChatBotProps } from '@/lib/types/chat';

export function ChatBot({ messages, addMessage, updateLastMessage, messageCount }: ChatBotProps) {
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hide quick actions if we have more than just the welcome message
  useEffect(() => {
    setShowQuickActions(messageCount <= 1);
  }, [messageCount]);

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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        {showQuickActions && (
          <QuickActions onActionClick={handleQuickAction} />
        )}
        <MessageList messages={messages} />
      </div>
      <div className="border-t p-4">
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