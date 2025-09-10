'use client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

import { CodeBlockRenderer } from './CodeBlockRenderer';
import { DataTableRenderer } from './DataTableRenderer';

interface MessageProps {
  message: Message;
}

export function MessageRenderer({ message }: MessageProps) {
  const content = message.content || '';
  
  // Check for code blocks
  if (content.includes('```')) {
    return <CodeBlockRenderer content={content} />;
  }
  
  // Check for table data (simple heuristic)
  if (content.includes('|') && content.includes('---')) {
    return <DataTableRenderer content={content} />;
  }
  
  // Standard message with markdown-like formatting
  return <StandardMessage content={content} />;
}

function StandardMessage({ content }: { content: string }) {
  // Simple markdown-like formatting
  const formatContent = (text: string) => {
    // Bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic text
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet points
    text = text.replace(/^• (.+)$/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    text = text.replace(/(<li>.*<\/li>\s*)+/g, '<ul>$&</ul>');
    
    return text;
  };

  return (
    <div 
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ 
        __html: formatContent(content) 
      }} 
    />
  );
}