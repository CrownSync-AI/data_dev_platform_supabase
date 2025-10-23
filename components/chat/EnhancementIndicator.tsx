'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Database, TrendingUp } from 'lucide-react';

export function EnhancementIndicator() {
  const [dots, setDots] = useState('');

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
    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 mt-4">
      <div className="relative">
        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
        <div className="absolute -inset-1 rounded-full border border-blue-500 opacity-20 animate-ping" />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-blue-700">
          Enhancing with live data
        </span>
        <span className="text-sm text-blue-600 font-mono w-6">
          {dots}
        </span>
      </div>
      
      <div className="flex items-center gap-1 ml-auto">
        <Database className="h-3 w-3 text-blue-400" />
        <TrendingUp className="h-3 w-3 text-blue-400" />
      </div>
    </div>
  );
}