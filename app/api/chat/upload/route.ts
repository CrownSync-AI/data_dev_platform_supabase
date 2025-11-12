import { NextRequest, NextResponse } from 'next/server';
import { DocumentRAGService } from '@/lib/services/documentRAGService';

const documentRAG = new DocumentRAGService();

// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userIdParam = formData.get('userId') as string;
    
    // Handle userId - only use if it's a valid UUID, otherwise use null
    let userId: string | undefined = undefined;
    if (userIdParam && userIdParam !== 'current-user' && isValidUUID(userIdParam)) {
      userId = userIdParam;
    }

    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file provided' 
      }, { status: 400 });
    }

    // Validate file type - temporarily disable PDF uploads due to parsing issues
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'text/csv'
    ];

    const allowedExtensions = ['.txt', '.md', '.markdown', '.csv'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    // Temporarily block PDF uploads with helpful message
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ 
        success: false,
        error: 'PDF uploads are temporarily disabled due to parsing issues. Please convert your PDF to a text file (.txt) or copy the content and save it as a text file. We support TXT, MD, and CSV files.' 
      }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return NextResponse.json({ 
        success: false,
        error: 'Supported file types: TXT, MD, CSV. For PDF content, please convert to text format first.' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false,
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    const result = await documentRAG.uploadDocument(file, userId);
    
    return NextResponse.json({ 
      success: true, 
      document: {
        id: result.id,
        title: result.title,
        file_type: result.file_type,
        file_size: result.file_size,
        upload_date: result.upload_date,
        is_connected_to_ai: result.is_connected_to_ai ?? true
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const documents = await documentRAG.getDocuments(userId || undefined);
    
    return NextResponse.json({ 
      success: true, 
      documents 
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get documents' 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ 
        success: false,
        error: 'Document ID is required' 
      }, { status: 400 });
    }

    await documentRAG.deleteDocument(documentId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Document deleted successfully' 
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete document' 
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, is_connected_to_ai } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false,
        error: 'Document ID is required' 
      }, { status: 400 });
    }

    if (typeof is_connected_to_ai !== 'boolean') {
      return NextResponse.json({ 
        success: false,
        error: 'is_connected_to_ai must be a boolean' 
      }, { status: 400 });
    }

    await documentRAG.updateDocumentConnection(id, is_connected_to_ai);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Document connection updated successfully' 
    });
  } catch (error) {
    console.error('Update document connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update document connection' 
    }, { status: 500 });
  }
}