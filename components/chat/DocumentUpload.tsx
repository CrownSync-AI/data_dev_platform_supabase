'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, Loader2, Bot, BotOff, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DocumentPreview } from './DocumentPreview';

interface UploadedDocument {
  id: string;
  title: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  is_connected_to_ai: boolean;
}

export function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<{
    id: string;
    title: string;
    fileType: string;
    fileSize: number;
    position: { x: number; y: number };
  } | null>(null);

  // Load existing documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);



  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat/upload');
      const result = await response.json();
      
      if (result.success) {
        setUploadedFiles(result.documents || []);
      } else {
        setError(result.error || 'Failed to load documents');
      }
    } catch (error) {
      console.error('Load documents error:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Don't send userId for now - let the backend handle it as null

      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadedFiles(prev => [result.document, ...prev]);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/chat/upload?id=${documentId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadedFiles(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        setError(result.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete document');
    }
  };

  const handleToggleAIConnection = async (documentId: string, isConnected: boolean) => {
    try {
      const response = await fetch('/api/chat/upload', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: documentId,
          is_connected_to_ai: isConnected
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadedFiles(prev => 
          prev.map(doc => 
            doc.id === documentId 
              ? { ...doc, is_connected_to_ai: isConnected }
              : doc
          )
        );
      } else {
        setError(result.error || 'Failed to update document connection');
      }
    } catch (error) {
      console.error('Toggle connection error:', error);
      setError('Failed to update document connection');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('text') || fileType.includes('markdown')) return 'bg-blue-100 text-blue-800';
    if (fileType.includes('csv')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handlePreviewClick = (event: React.MouseEvent, file: UploadedDocument) => {
    event.stopPropagation(); // Prevent event bubbling
    
    // If already showing this document, close it
    if (previewDocument && previewDocument.id === file.id) {
      setPreviewDocument(null);
      return;
    }

    // Calculate position relative to the clicked element
    const rect = event.currentTarget.closest('[data-document-id]')?.getBoundingClientRect();
    if (!rect) return;

    setPreviewDocument({
      id: file.id,
      title: file.title,
      fileType: file.file_type,
      fileSize: file.file_size,
      position: {
        x: rect.right + 10,
        y: rect.top
      }
    });
  };

  const handleClosePreview = () => {
    setPreviewDocument(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Upload your documents</p>
            <p className="text-gray-600 mb-4">
              Supported formats: TXT, MD, CSV (max 10MB)
            </p>
            <p className="text-sm text-amber-600 mb-4">
              📄 For PDF content: Please copy the text and save as a .txt file, or use online PDF-to-text converters
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <input
              type="file"
              accept=".txt,.md,.markdown,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <Button 
              asChild 
              disabled={uploading}
              className="cursor-pointer"
            >
              <label htmlFor="file-upload">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Choose File'
                )}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Documents
            {uploadedFiles.length > 0 && (
              <>
                <Badge variant="secondary">{uploadedFiles.length} total</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {uploadedFiles.filter(f => f.is_connected_to_ai).length} connected to AI
                </Badge>
              </>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Toggle the switch to control which documents the AI chatbot can access
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading documents...</span>
            </div>
          ) : uploadedFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload documents to start asking questions about their content</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors relative group"
                  data-document-id={file.id}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{file.title}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                          previewDocument?.id === file.id ? 'opacity-100 text-blue-600' : 'text-muted-foreground hover:text-blue-600'
                        }`}
                        onClick={(e) => handlePreviewClick(e, file)}
                        title="Preview document content"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={getFileTypeColor(file.file_type)}
                      >
                        {file.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(file.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* AI Connection Toggle */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
                    {file.is_connected_to_ai ? (
                      <Bot className="h-4 w-4 text-blue-500" />
                    ) : (
                      <BotOff className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <Switch
                        checked={file.is_connected_to_ai}
                        onCheckedChange={(checked) => handleToggleAIConnection(file.id, checked)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <span className="text-xs text-muted-foreground">
                        {file.is_connected_to_ai ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocument(file.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="font-medium text-primary">1.</span>
              <span>Upload your documents using the form above</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-primary">2.</span>
              <span>Go to the Chat tab and ask questions about your documents</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-primary">3.</span>
              <span>The AI will search through your documents to find relevant information</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Example questions:</strong> "What are the key findings in the report?", 
              "Summarize the main points from the uploaded document", 
              "What does the document say about performance metrics?"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Preview */}
      {previewDocument && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleClosePreview}
          />
          {/* Preview */}
          <DocumentPreview
            documentId={previewDocument.id}
            title={previewDocument.title}
            fileType={previewDocument.fileType}
            fileSize={previewDocument.fileSize}
            isVisible={true}
            position={previewDocument.position}
            onClose={handleClosePreview}
          />
        </>
      )}
    </div>
  );
}