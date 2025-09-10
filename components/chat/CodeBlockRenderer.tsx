'use client';

interface CodeBlockRendererProps {
  content: string;
}

export function CodeBlockRenderer({ content }: CodeBlockRendererProps) {
  const parts = content.split('```');
  
  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          // Regular text
          return part.trim() ? (
            <div key={index} className="whitespace-pre-wrap">
              {part}
            </div>
          ) : null;
        } else {
          // Code block
          const lines = part.split('\n');
          const language = lines[0].trim();
          const code = lines.slice(1).join('\n').trim();
          
          return (
            <div key={index} className="rounded-md bg-gray-900 text-gray-100 p-3 text-sm font-mono overflow-x-auto">
              {language && (
                <div className="text-gray-400 text-xs mb-2 uppercase">
                  {language}
                </div>
              )}
              <pre className="whitespace-pre-wrap">{code}</pre>
            </div>
          );
        }
      })}
    </div>
  );
}