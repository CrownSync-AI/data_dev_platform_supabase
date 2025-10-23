'use client';

import { useEffect, useState } from 'react';
import { Bot, Search, Database, FileText, Sparkles } from 'lucide-react';

interface ThinkingIndicatorProps {
  stage?: 'analyzing' | 'searching' | 'querying' | 'generating';
  message?: string;
  enableDynamicText?: boolean;
}

const stages = {
  analyzing: {
    icon: Bot,
    message: 'Analyzing your query...',
    color: 'text-blue-500',
    loaderColor: '#3b82f6',
    duration: 800,
    dynamicPhrases: [
      'Analyzing your query...',
      'Understanding your request...',
      'Processing your question...',
      'Interpreting your needs...',
      'Breaking down the query...',
      'Examining the context...'
    ]
  },
  searching: {
    icon: Search,
    message: 'Searching documents...',
    color: 'text-green-500',
    loaderColor: '#10b981',
    duration: 1200,
    dynamicPhrases: [
      'Searching documents...',
      'Scanning through files...',
      'Looking for relevant information...',
      'Digging through the archives...',
      'Exploring document contents...',
      'Finding the right details...'
    ]
  },
  querying: {
    icon: Database,
    message: 'Querying database...',
    color: 'text-purple-500',
    loaderColor: '#8b5cf6',
    duration: 1000,
    dynamicPhrases: [
      'Querying database...',
      'Retrieving information from the database...',
      'Accessing campaign data...',
      'Gathering performance metrics...',
      'Collecting retailer insights...',
      'Pulling analytics data...'
    ]
  },
  generating: {
    icon: Sparkles,
    message: 'Generating response...',
    color: 'text-orange-500',
    loaderColor: '#f97316',
    duration: 1500,
    dynamicPhrases: [
      'Generating response...',
      'Crafting your answer...',
      'Preparing detailed insights...',
      'Compiling the results...',
      'Finalizing the analysis...',
      'Almost ready with your answer...'
    ]
  }
};

export function ThinkingIndicator({ stage = 'analyzing', message, enableDynamicText = true }: ThinkingIndicatorProps) {
  const currentStage = stages[stage];
  const Icon = currentStage.icon;
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(message || currentStage.message);

  // Dynamic text cycling effect
  useEffect(() => {
    if (!enableDynamicText || message) {
      setDisplayText(message || currentStage.message);
      return;
    }

    const phrases = currentStage.dynamicPhrases;
    let phraseIndex = 0;

    const cycleText = () => {
      setCurrentPhraseIndex(phraseIndex);
      setDisplayText(phrases[phraseIndex]);
      phraseIndex = (phraseIndex + 1) % phrases.length;
    };

    // Initial text
    cycleText();

    // Cycle through phrases every 2 seconds
    const interval = setInterval(cycleText, 2000);

    return () => clearInterval(interval);
  }, [stage, message, enableDynamicText, currentStage]);

  return (
    <div className="flex items-center gap-3">
      <Icon className={`h-4 w-4 ${currentStage.color} animate-pulse`} />
      
      <div className="flex-1">
        <span 
          className={`text-sm ${currentStage.color} transition-opacity duration-300`}
          key={currentPhraseIndex} // Force re-render for smooth transition
        >
          {displayText}
        </span>
        
        {/* Enhanced CSS Loader */}
        <div className="llm-loader mt-2" style={{ '--loader-color': currentStage.loaderColor } as any} />
      </div>
      
      <style jsx>{`
        .llm-loader {
          height: 20px;
          aspect-ratio: 2;
          border-bottom: 2px solid transparent;
          background: linear-gradient(90deg, var(--loader-color) 50%, transparent 0) -25% 100%/50% 2px repeat-x border-box;
          position: relative;
          animation: llm-loader-track 0.75s linear infinite;
        }
        
        .llm-loader:before {
          content: "";
          position: absolute;
          inset: auto 42.5% 0;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--loader-color);
          animation: llm-loader-ball 0.75s cubic-bezier(0, 900, 1, 900) infinite;
        }
        
        @keyframes llm-loader-track {
          to {
            background-position: -125% 100%;
          }
        }
        
        @keyframes llm-loader-ball {
          0%, 2% {
            bottom: 0%;
          }
          98%, 100% {
            bottom: 0.1%;
          }
        }
      `}</style>
    </div>
  );
}

// Multi-stage thinking indicator with enhanced animations
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
    <div className="space-y-4">
      {/* Current active stage with enhanced loader */}
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
                flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-500
                ${isActive 
                  ? `${stages[stageName].color} ${stages[stageName].color.replace('text-', 'border-')} bg-white shadow-md scale-110` 
                  : isCompleted 
                    ? 'bg-green-500 border-green-500 text-white shadow-sm'
                    : 'border-gray-300 text-gray-400'
                }
              `}>
                <StageIcon className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} />
              </div>
              
              {index < stageOrder.length - 1 && (
                <div className={`
                  w-10 h-0.5 mx-2 transition-all duration-500 rounded-full
                  ${isCompleted ? 'bg-green-500 shadow-sm' : isActive ? 'bg-gradient-to-r from-current to-gray-300' : 'bg-gray-300'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Contextual thinking indicator based on query type with dynamic text
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

  const stage = getStageFromQuery(query);

  // Use dynamic text cycling instead of static contextual message
  return <ThinkingIndicator stage={stage} enableDynamicText={true} />;
}

// Enhanced dynamic thinking indicator with more engaging phrases
export function DynamicThinkingIndicator({ 
  stage = 'analyzing',
  customPhrases 
}: { 
  stage?: keyof typeof stages;
  customPhrases?: string[];
}) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  // Enhanced phrases for more engaging experience
  const enhancedPhrases = customPhrases || [
    'Analyzing data...',
    'Digging deeper for the answer...',
    'Retrieving information from the database...',
    'Processing your request...',
    'Connecting the dots...',
    'Gathering insights...',
    'Almost there...',
    'Finalizing the response...'
  ];

  useEffect(() => {
    let phraseIndex = 0;

    const cycleText = () => {
      setCurrentPhraseIndex(phraseIndex);
      setDisplayText(enhancedPhrases[phraseIndex]);
      phraseIndex = (phraseIndex + 1) % enhancedPhrases.length;
    };

    // Initial text
    cycleText();

    // Cycle through phrases every 1.8 seconds for more dynamic feel
    const interval = setInterval(cycleText, 1800);

    return () => clearInterval(interval);
  }, [stage, customPhrases]);

  return (
    <div className="flex items-center gap-3">
      <Icon className={`h-4 w-4 ${currentStage.color} animate-pulse`} />
      
      <div className="flex-1">
        <span 
          className={`text-sm ${currentStage.color} transition-all duration-500 ease-in-out`}
          key={currentPhraseIndex}
          style={{
            animation: 'fadeInOut 0.5s ease-in-out'
          }}
        >
          {displayText}
        </span>
        
        {/* Enhanced CSS Loader */}
        <div className="llm-loader mt-2" style={{ '--loader-color': currentStage.loaderColor } as any} />
      </div>
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0.7; transform: translateY(2px); }
          50% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .llm-loader {
          height: 20px;
          aspect-ratio: 2;
          border-bottom: 2px solid transparent;
          background: linear-gradient(90deg, var(--loader-color) 50%, transparent 0) -25% 100%/50% 2px repeat-x border-box;
          position: relative;
          animation: llm-loader-track 0.75s linear infinite;
        }
        
        .llm-loader:before {
          content: "";
          position: absolute;
          inset: auto 42.5% 0;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--loader-color);
          animation: llm-loader-ball 0.75s cubic-bezier(0, 900, 1, 900) infinite;
        }
        
        @keyframes llm-loader-track {
          to {
            background-position: -125% 100%;
          }
        }
        
        @keyframes llm-loader-ball {
          0%, 2% {
            bottom: 0%;
          }
          98%, 100% {
            bottom: 0.1%;
          }
        }
      `}</style>
    </div>
  );
}