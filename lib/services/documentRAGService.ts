import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

export interface DocumentUpload {
  id: string;
  title: string;
  content: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  created_by?: string;
  is_connected_to_ai?: boolean;
}

export interface DocumentSearchResult {
  id: string;
  title: string;
  content: string;
  file_type: string;
  upload_date: string;
  similarity: number;
}

export class DocumentRAGService {
  private supabase;
  private openai;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
  }

  /**
   * Upload and process document
   */
  async uploadDocument(file: File, userId?: string): Promise<DocumentUpload> {
    try {
      const content = await this.extractTextFromFile(file);
      const embedding = await this.generateEmbedding(content);
      
      // Try to insert with is_connected_to_ai field, fallback if column doesn't exist
      let insertData: any = {
        title: file.name,
        content,
        file_type: file.type,
        file_size: file.size,
        embedding,
        created_by: userId,
        metadata: {
          original_name: file.name,
          processed_at: new Date().toISOString()
        }
      };

      // Try with is_connected_to_ai field first
      let { data, error } = await this.supabase
        .from('documents')
        .insert({
          ...insertData,
          is_connected_to_ai: true
        })
        .select()
        .single();

      // If column doesn't exist, try without it
      if (error && error.message.includes('is_connected_to_ai')) {
        console.log('is_connected_to_ai column not found, inserting without it...');
        const result = await this.supabase
          .from('documents')
          .insert(insertData)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Document upload error:', error);
        throw new Error(`Failed to upload document: ${error.message}`);
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        file_type: data.file_type,
        file_size: data.file_size,
        upload_date: data.upload_date,
        created_by: data.created_by,
        is_connected_to_ai: data.is_connected_to_ai ?? true
      };
    } catch (error) {
      console.error('Document processing error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings using OpenAI text-embedding-3-small
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Truncate text if too long (max ~8000 tokens for text-embedding-3-small)
      const truncatedText = text.length > 32000 ? text.substring(0, 32000) : text;
      
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: truncatedText
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Search similar documents using vector similarity
   */
  async searchSimilarDocuments(query: string, limit: number = 5): Promise<DocumentSearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      
      const { data, error } = await this.supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit
      });

      if (error) {
        console.error('Document search error:', error);
        throw new Error(`Failed to search documents: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Document search error:', error);
      throw error;
    }
  }

  /**
   * Get all uploaded documents
   */
  async getDocuments(userId?: string): Promise<DocumentUpload[]> {
    try {
      // Try to select with is_connected_to_ai, fallback if column doesn't exist
      let query = this.supabase
        .from('documents')
        .select('id, title, file_type, file_size, upload_date, created_by, is_connected_to_ai')
        .order('upload_date', { ascending: false });

      let { data, error } = await query;

      // If column doesn't exist, try without it
      if (error && error.message.includes('is_connected_to_ai')) {
        console.log('is_connected_to_ai column not found, selecting without it...');
        const fallbackQuery = this.supabase
          .from('documents')
          .select('id, title, file_type, file_size, upload_date, created_by')
          .order('upload_date', { ascending: false });
        
        const result = await fallbackQuery;
        data = result.data;
        error = result.error;
      }

      if (userId) {
        query = query.eq('created_by', userId);
      }

      if (error) {
        console.error('Get documents error:', error);
        throw new Error(`Failed to get documents: ${error.message}`);
      }

      return data?.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: '', // Don't return full content in list
        file_type: doc.file_type,
        file_size: doc.file_size,
        upload_date: doc.upload_date,
        created_by: doc.created_by,
        is_connected_to_ai: doc.is_connected_to_ai ?? true
      })) || [];
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Delete document error:', error);
        throw new Error(`Failed to delete document: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  /**
   * Update document AI connection status
   */
  async updateDocumentConnection(documentId: string, isConnected: boolean): Promise<void> {
    try {
      // Try to update with is_connected_to_ai field
      let { error } = await this.supabase
        .from('documents')
        .update({ is_connected_to_ai: isConnected })
        .eq('id', documentId);

      // If column doesn't exist in schema cache, the feature isn't fully set up yet
      if (error && error.message.includes('is_connected_to_ai')) {
        console.log('is_connected_to_ai column not found in schema cache. Database setup may be incomplete.');
        throw new Error('Document connection feature is not fully set up. Please run the database setup script first.');
      }

      if (error) {
        console.error('Update document connection error:', error);
        throw new Error(`Failed to update document connection: ${error.message}`);
      }
    } catch (error) {
      console.error('Update document connection error:', error);
      throw error;
    }
  }

  /**
   * Extract text from different file types
   */
  private async extractTextFromFile(file: File): Promise<string> {
    try {
      console.log(`Extracting text from file: ${file.name}, type: ${file.type}, size: ${file.size}`);
      
      // Handle text files
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        return await file.text();
      }
      
      // Handle markdown files by extension
      if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
        return await file.text();
      }
      
      // Handle PDF files with better error handling
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        try {
          console.log(`Processing PDF file: ${file.name}`);
          const buffer = await file.arrayBuffer();
          console.log(`PDF buffer size: ${buffer.byteLength} bytes`);
          
          // Use pdf-parse with explicit buffer handling to avoid file system access
          const pdfParse = require('pdf-parse');
          
          // Convert ArrayBuffer to Buffer explicitly
          const nodeBuffer = Buffer.from(buffer);
          
          // Parse PDF with options that prevent file system access
          const parseOptions = {
            // Don't try to read from file system
            max: 0, // Parse all pages
            version: 'default', // Don't auto-detect version
            // Provide data directly to prevent file system access
            normalizeWhitespace: true,
            disableCombineTextItems: false
          };
          
          console.log('Calling pdf-parse with buffer...');
          const data = await pdfParse(nodeBuffer, parseOptions);
          
          console.log(`Successfully extracted ${data.text?.length || 0} characters from PDF`);
          
          if (!data.text || data.text.trim().length === 0) {
            throw new Error('PDF appears to be empty or contains no extractable text. This might be a scanned PDF that requires OCR.');
          }
          
          return data.text.trim();
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          
          // Provide more helpful error messages
          if (pdfError.message.includes('ENOENT')) {
            throw new Error('PDF parsing failed due to file access issue. Please try a different PDF or convert it to text format first.');
          } else if (pdfError.message.includes('Invalid PDF')) {
            throw new Error('The uploaded file appears to be corrupted or is not a valid PDF.');
          } else {
            throw new Error(`Failed to extract text from PDF: ${pdfError.message}. Please try converting the PDF to text format first.`);
          }
        }
      }
      
      // Handle CSV files
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        return await file.text();
      }
      
      // Try to read as text for other types
      try {
        const text = await file.text();
        if (text.trim().length === 0) {
          throw new Error('File appears to be empty');
        }
        return text;
      } catch (textError) {
        console.error('Text extraction fallback error:', textError);
        throw new Error(`Unsupported file type: ${file.type}. Supported types: PDF, TXT, MD, CSV`);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw error;
    }
  }

  /**
   * Get document content by ID
   */
  async getDocumentContent(documentId: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('content')
        .eq('id', documentId)
        .single();

      if (error) {
        console.error('Get document content error:', error);
        throw new Error(`Failed to get document content: ${error.message}`);
      }

      return data?.content || '';
    } catch (error) {
      console.error('Get document content error:', error);
      throw error;
    }
  }
}