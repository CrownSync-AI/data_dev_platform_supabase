-- Simple chatbot schema setup for Supabase SQL Editor
-- Run this in your Supabase SQL Editor

-- Enable vector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table for RAG
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMP DEFAULT NOW(),
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);

-- Vector search function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  file_type text,
  upload_date timestamp,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    documents.id,
    documents.title,
    documents.content,
    documents.file_type,
    documents.upload_date,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON chat_conversations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON chat_messages FOR ALL USING (true);