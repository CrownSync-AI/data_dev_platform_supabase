'use client';

import { useEffect, useState } from 'react';
import { Bot, Search, Database, FileText, Sparkles } from 'lucide-react';

interface ThinkingIndicatorProps {
  stage?: 'analyzing' | 'searching' | 'querying' | 'generating';
  message?: string;
}

const stages = {
  analyzing: {
    icon: Bot,
    message: 'Analyzing your query...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    duration: 800
  },
  searching: {
    icon: Search,
    message: 'Searching documents...',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    duration: 1200
  },
  querying: {
    icon: Database,
    message: 'Querying database...',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    duration: 1000
  },
  generating: {
    icon: Sparkles,
    message: 'Generating response...',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    duration: 1500
  }
};

export function ThinkingIndicator({ stage = 'analyzing', message }: ThinkingIndicatorProps) {
  const [dots, setDots] = useState('');
  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg ${currentStage.bgColor} border border-gray-200`}>
      <div className="relative">
        <Icon className={`h-5 w-5 ${currentStage.color} animate-pulse`} />
        <div className="absolute -inset-1 rounded-full border-2 border-current opacity-20 animate-ping" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${currentStage.color}`}>
            {message || currentStage.message}
          </span>
          <span className={`text-sm ${currentStage.color} font-mono w-6`}>
            {dots}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full ${currentStage.color.replace('text-', 'bg-')} animate-pulse`}
            style={{
              width: '60%',
              animation: 'progress 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 20%; }
          50% { width: 80%; }
          100% { width: 20%; }
        }
      `}</style>
    </div>
  );
}

// Multi-stage thinking indicator
export function MultiStageThinkingIndicator({ 
  currentStage = 'analyzing',
  stages: customStages 
}: { 
  currentStage: keyof typeof stages;
  stages?: (keyof typeof stages)[];
}) {
  const stageOrder = customStages || ['analyzing', 'searching', 'querying', 'generating'];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="space-y-3">
      {/* Current active stage */}
      <ThinkingIndicator stage={currentStage} />
      
      {/* Progress through stages */}
      <div className="flex items-center gap-2 px-4">
        {stageOrder.map((stageName, index) => {
          const StageIcon = stages[stageName].icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={stageName} className="flex items-center">
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300
                ${isActive 
                  ? `${stages[stageName].color} ${stages[stageName].color.replace('text-', 'border-')} bg-white` 
                  : isCompleted 
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }
              `}>
                <StageIcon className="w-3 h-3" />
              </div>
              
              {index < stageOrder.length - 1 && (
                <div className={`
                  w-8 h-0.5 mx-1 transition-all duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Contextual thinking indicator based on query type
export function ContextualThinkingIndicator({ query }: { query: string }) {
  const getStageFromQuery = (query: string): keyof typeof stages => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('document') || lowerQuery.includes('file') || lowerQuery.includes('upload')) {
      return 'searching';
    }
    if (lowerQuery.includes('campaign') || lowerQuery.includes('retailer') || lowerQuery.includes('performance')) {
      return 'querying';
    }
    if (lowerQuery.includes('summary') || lowerQuery.includes('analyze') || lowerQuery.includes('explain')) {
      return 'generating';
    }
    
    return 'analyzing';
  };

  const getContextualMessage = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('document')) {
      return 'Searching through your uploaded documents...';
    }
    if (lowerQuery.includes('campaign')) {
      return 'Analyzing campaign performance data...';
    }
    if (lowerQuery.includes('retailer')) {
      return 'Checking retailer rankings and metrics...';
    }
    if (lowerQuery.includes('performance')) {
      return 'Gathering performance analytics...';
    }
    
    return 'Processing your request...';
  };

  const stage = getStageFromQuery(query);
  const message = getContextualMessage(query);

  return <ThinkingIndicator stage={stage} message={message} />;
}