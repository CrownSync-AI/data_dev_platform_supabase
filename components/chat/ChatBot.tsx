'use client';

import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { ContextualThinkingIndicator, DynamicThinkingIndicator } from './ThinkingIndicator';
import { EnhancementIndicator } from './EnhancementIndicator';
import { PresetResponsesService } from '@/lib/services/presetResponsesService';
import { useState, useEffect, useRef } from 'react';
import { Message, ChatBotProps } from '@/lib/types/chat';

interface ExtendedChatBotProps extends ChatBotProps {
  isEmbeddedMode?: boolean;
}

export function ChatBot({ messages, addMessage, updateLastMessage, messageCount, isEmbeddedMode = false }: ExtendedChatBotProps) {
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<'analyzing' | 'searching' | 'querying' | 'generating' | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
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
    setCurrentQuery(userMessage);
    setInput('');
    setShowQuickActions(false);

    // Check for preset response (Phase 1: Immediate Response)
    const presetResponse = PresetResponsesService.getPresetResponse(userMessage);
    
    if (presetResponse) {
      // Show preset response immediately (0ms delay)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: presetResponse.response
      };
      
      addMessage(assistantMsg);
      
      // Show enhancement indicator
      setIsEnhancing(true);
      setProcessingStage('querying');
      
      // Small delay to show the preset response before enhancement
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // No preset available, show thinking process
      const stages = getProcessingStages(userMessage);
      let currentStageIndex = 0;
      
      setProcessingStage(stages[0]);

      // Progress through stages with realistic timing
      const stageInterval = setInterval(() => {
        currentStageIndex++;
        if (currentStageIndex < stages.length) {
          setProcessingStage(stages[currentStageIndex]);
        } else {
          clearInterval(stageInterval);
        }
      }, 800);
    }

    try {
      // Phase 2: Fetch live data enhancement
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

      // Clear indicators
      setProcessingStage(null);
      setIsEnhancing(false);

      if (!presetResponse) {
        // No preset was shown, add new assistant message
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: ''
        };
        addMessage(assistantMsg);
      }

      const decoder = new TextDecoder();
      let done = false;
      let fullContent = presetResponse ? presetResponse.response + '\n\n---\n\n**🔄 Enhanced with Live Data:**\n\n' : '';

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
      setProcessingStage(null);
      setIsEnhancing(false);
      
      if (!presetResponse) {
        const errorMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        addMessage(errorMsg);
      } else {
        // If preset was shown but enhancement failed, update with error note
        updateLastMessage(presetResponse.response + '\n\n*⚠️ Unable to fetch live data enhancement. Showing cached information.*');
      }
    } finally {
      setIsLoading(false);
      setCurrentQuery('');
    }
  };

  // Determine processing stages based on query content
  const getProcessingStages = (query: string): ('analyzing' | 'searching' | 'querying' | 'generating')[] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('document') || lowerQuery.includes('file') || lowerQuery.includes('upload')) {
      return ['analyzing', 'searching', 'generating'];
    }
    if (lowerQuery.includes('campaign') || lowerQuery.includes('retailer') || lowerQuery.includes('performance')) {
      return ['analyzing', 'querying', 'generating'];
    }
    if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      return ['analyzing', 'searching', 'querying', 'generating'];
    }
    
    return ['analyzing', 'generating'];
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
        
        {/* Show thinking indicator when processing */}
        {processingStage && (
          <div className="mb-4">
            <ContextualThinkingIndicator query={currentQuery} />
          </div>
        )}
        
        {/* Show enhancement indicator when enhancing preset response */}
        {isEnhancing && (
          <div className="mb-4">
            <EnhancementIndicator />
          </div>
        )}
        
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