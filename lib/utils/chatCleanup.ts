/**
 * Chat cleanup utilities for managing session-based chat persistence
 */

const CHAT_STORAGE_KEY = 'crownsync_chat_messages';

/**
 * Clear chat messages from sessionStorage
 * This should be called on logout to ensure chat data doesn't persist across sessions
 */
export function clearChatSession() {
  try {
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    console.log('Chat session cleared');
  } catch (error) {
    console.error('Error clearing chat session:', error);
  }
}

/**
 * Check if there are existing chat messages in sessionStorage
 */
export function hasChatSession(): boolean {
  try {
    const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
    return stored !== null && stored !== '';
  } catch (error) {
    console.error('Error checking chat session:', error);
    return false;
  }
}

/**
 * Get the number of messages in the current chat session
 */
export function getChatMessageCount(): number {
  try {
    const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      const messages = JSON.parse(stored);
      return Array.isArray(messages) ? messages.length : 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting chat message count:', error);
    return 0;
  }
}

/**
 * Setup cleanup listener for when the user navigates away or closes the tab
 * This is a fallback in case logout cleanup doesn't run
 */
export function setupChatCleanupListeners() {
  // Clear chat on page unload (when user closes tab/browser)
  const handleUnload = () => {
    clearChatSession();
  };

  // Clear chat on visibility change (when user switches tabs for extended periods)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Optional: You might want to implement a timer here to clear after extended inactivity
      // For now, we'll rely on logout cleanup
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}