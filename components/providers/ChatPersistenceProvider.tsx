'use client';

import { useEffect } from 'react';
import { setupChatCleanupListeners } from '@/lib/utils/chatCleanup';

interface ChatPersistenceProviderProps {
  children: React.ReactNode;
}

export function ChatPersistenceProvider({ children }: ChatPersistenceProviderProps) {
  useEffect(() => {
    // Setup cleanup listeners for browser events
    const cleanup = setupChatCleanupListeners();
    
    // Return cleanup function to remove listeners when component unmounts
    return cleanup;
  }, []);

  return <>{children}</>;
}