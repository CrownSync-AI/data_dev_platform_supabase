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
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<'analyzing' | 'searching' | 'querying' | 'generating' | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    // Check for preset response (New Mock Response Approach)
    const presetResponse = PresetResponsesService.getPresetResponse(userMessage);
    
    if (presetResponse) {
      // NEW FLOW: Mock thinking animation for 5-7 seconds
      const stages = getProcessingStages(userMessage);
      let currentStageIndex = 0;
      
      setProcessingStage(stages[0]);

      // Progress through stages with realistic timing (5-7 seconds total)
      const stageInterval = setInterval(() => {
        currentStageIndex++;
        if (currentStageIndex < stages.length) {
          setProcessingStage(stages[currentStageIndex]);
        } else {
          clearInterval(stageInterval);
        }
      }, Math.floor((6000) / stages.length)); // Distribute 6 seconds across stages

      // Wait for the full thinking animation (6 seconds)
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Clear thinking indicator
      setProcessingStage(null);
      
      // Add assistant message and start typing effect
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      };
      
      addMessage(assistantMsg);
      
      // Typing effect: Display response character by character
      await simulateTypingEffect(presetResponse.response);
      
    } else {
      // No preset available, show thinking process for regular queries
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

    // Only fetch live data for non-preset responses
    if (!presetResponse) {
      try {
        // Fetch live data for regular queries
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

        // Add new assistant message for streaming response
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
        setProcessingStage(null);
        
        const errorMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        addMessage(errorMsg);
      }
    }

    // Clean up
    setIsLoading(false);
    setCurrentQuery('');
    setProcessingStage(null);
    setIsEnhancing(false);
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

  // Simulate typing effect for preset responses
  const simulateTypingEffect = async (text: string) => {
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      updateLastMessage(currentText);
      
      // Vary typing speed: faster for short words, slower for longer words
      const delay = words[i].length > 6 ? 100 : 50;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
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
        <QuickActions onActionClick={handleQuickAction} />
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