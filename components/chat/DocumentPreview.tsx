'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, AlertCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentPreviewProps {
  documentId: string;
  title: string;
  fileType: string;
  fileSize: number;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose?: () => void;
}

interface DocumentContent {
  content: string;
  preview: string; // First 500 characters
  wordCount: number;
  lineCount: number;
}

export function DocumentPreview({ 
  documentId, 
  title, 
  fileType, 
  fileSize, 
  isVisible, 
  position,
  onClose
}: DocumentPreviewProps) {
  const [content, setContent] = useState<DocumentContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && !content && !loading) {
      fetchDocumentContent();
    }
  }, [isVisible, documentId]);

  const fetchDocumentContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/upload/preview?id=${documentId}`);
      const result = await response.json();

      if (result.success) {
        setContent(result.content);
      } else {
        setError(result.error || 'Failed to load preview');
      }
    } catch (error) {
      console.error('Preview fetch error:', error);
      setError('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isVisible) return null;

  // Calculate safe position to prevent preview from going off-screen
  const previewWidth = 400;
  const previewHeight = 300;
  
  let safePosition = {
    x: position.x,
    y: position.y
  };

  // Check if preview would go off the right edge
  if (position.x + previewWidth > window.innerWidth) {
    // Position to the left of the cursor instead
    safePosition.x = position.x - previewWidth - 20;
  }

  // Check if preview would go off the bottom edge
  if (position.y + previewHeight > window.innerHeight) {
    safePosition.y = window.innerHeight - previewHeight - 20;
  }

  // Ensure minimum distance from edges
  safePosition.x = Math.max(20, safePosition.x);
  safePosition.y = Math.max(20, safePosition.y);

  return (
    <div
      className="fixed z-50 w-96 max-w-md pointer-events-auto"
      style={{
        left: safePosition.x,
        top: safePosition.y,
        maxHeight: '400px'
      }}
    >
      <Card className="shadow-xl border-2 bg-white backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{title}</span>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600 flex-shrink-0"
                onClick={onClose}
                title="Close preview"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {fileType.split('/')[1]?.toUpperCase() || 'FILE'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(fileSize)}
            </span>
            {content && (
              <>
                <span className="text-xs text-muted-foreground">
                  {content.wordCount.toLocaleString()} words
                </span>
                <span className="text-xs text-muted-foreground">
                  {content.lineCount.toLocaleString()} lines
                </span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Loading preview...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 py-4 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : content ? (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                <span>Content Preview:</span>
                <span className="text-xs text-blue-600">Scrollable</span>
              </div>
              <div 
                className="text-sm bg-muted/30 p-3 rounded-md max-h-40 overflow-y-auto border hover:bg-muted/40 transition-colors cursor-text"
                style={{ fontSize: '11px', lineHeight: '1.4' }}
              >
                {fileType.includes('csv') ? (
                  // Special handling for CSV files
                  <div className="font-mono">
                    {content.preview.split('\n').slice(0, 8).map((line, index) => (
                      <div key={index} className="border-b border-muted/20 py-1">
                        {line.split(',').slice(0, 4).join(' | ')}
                        {line.split(',').length > 4 && ' | ...'}
                      </div>
                    ))}
                    {content.lineCount > 8 && (
                      <div className="text-muted-foreground mt-2">
                        ... and {content.lineCount - 8} more rows
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular text content
                  <pre className="whitespace-pre-wrap font-mono">
                    {content.preview}
                    {content.content.length > content.preview.length && (
                      <span className="text-muted-foreground">
                        {'\n\n... (showing first 500 characters of '}
                        {content.content.length.toLocaleString()} total)
                      </span>
                    )}
                  </pre>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}