'use client';

import { Sparkles, Database, TrendingUp } from 'lucide-react';

export function EnhancementIndicator() {
  return (
    <div className="flex items-center gap-3">
      <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-600">
            Enhancing with live data
          </span>
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3 text-blue-400" />
            <TrendingUp className="h-3 w-3 text-blue-400" />
          </div>
        </div>
        
        {/* Enhanced CSS Loader for Enhancement */}
        <div className="enhancement-loader mt-2" />
      </div>
      
      <style jsx>{`
        .enhancement-loader {
          height: 18px;
          aspect-ratio: 2;
          border-bottom: 2px solid transparent;
          background: linear-gradient(90deg, #3b82f6 50%, transparent 0) -25% 100%/50% 2px repeat-x border-box;
          position: relative;
          animation: enhancement-loader-track 0.6s linear infinite;
        }
        
        .enhancement-loader:before {
          content: "";
          position: absolute;
          inset: auto 42.5% 0;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #1d4ed8;
          animation: enhancement-loader-ball 0.6s cubic-bezier(0, 900, 1, 900) infinite;
        }
        
        @keyframes enhancement-loader-track {
          to {
            background-position: -125% 100%;
          }
        }
        
        @keyframes enhancement-loader-ball {
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