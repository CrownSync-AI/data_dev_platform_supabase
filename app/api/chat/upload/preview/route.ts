import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Fetch document from database
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, content, file_type, file_size')
      .eq('id', documentId)
      .single();

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Process content for preview
    const content = document.content || '';
    const preview = content.length > 500 ? content.substring(0, 500) : content;
    
    // Calculate stats
    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;
    const lineCount = content.split('\n').length;

    const result = {
      content: content,
      preview: preview,
      wordCount: wordCount,
      lineCount: lineCount
    };

    return NextResponse.json({
      success: true,
      content: result
    });

  } catch (error) {
    console.error('Preview API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}