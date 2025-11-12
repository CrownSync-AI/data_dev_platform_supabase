# LLM Chat Assistant Setup Summary

## 🤖 Current LLM Configuration

### **Model & Provider**
- **LLM Model**: `gpt-5-nano` (OpenAI)
- **Provider**: OpenAI via `@ai-sdk/openai`
- **Framework**: Vercel AI SDK (`ai` package)
- **Streaming**: Real-time text streaming enabled
- **Temperature**: 0.7 (balanced creativity/consistency)

### **API Configuration**
- **Endpoint**: `/api/chat` (POST)
- **Authentication**: OpenAI API Key via environment variable
- **Response Type**: Streaming text response
- **Error Handling**: Comprehensive error catching and logging

## 🧠 System Prompt & Instructions

### **Core Identity**
```
You are a helpful AI assistant for the CrownSync Data Development Platform 
with LIVE DATABASE AND DOCUMENT ACCESS.
```

### **Capabilities Defined**
1. **Real-time database data** from the CrownSync platform
2. **Uploaded documents** that users have shared with you

### **Key Instructions**
- **Document Priority**: Always reference and use uploaded document content when provided
- **Specific Responses**: Provide quotes, summaries, and insights from documents
- **Clear Communication**: State when no matching documents are found
- **Data Integration**: Use live database data to answer queries

### **Database Knowledge**
The assistant is informed about these key tables:
- **campaigns**: Marketing campaign data with budgets, dates, and status
- **campaign_performance_summary**: Campaign analytics including ROI, email metrics, and performance tiers
- **retailer_performance_dashboard**: Retailer rankings, regions, performance grades, and sales data
- **users**: User information including retailers, brands, admins, regions, and activity status
- **email_sends**: Email delivery and engagement data
- **email_campaigns**: Email campaign details and content

## 🔍 Data Access & RAG Implementation

### **Document Search (Vector RAG)**
- **Embedding Model**: `text-embedding-3-small` (OpenAI)
- **Vector Database**: Supabase with pgvector extension
- **Search Function**: `match_documents_connected` (with fallback to `match_documents`)
- **Similarity Threshold**: 0.1
- **Result Limit**: 3 documents per query
- **Content Truncation**: 1500 characters per document (with ellipsis)

### **Database RAG Service**
**File**: `lib/services/databaseRAGService.ts`

**Available Query Methods**:
1. **getCampaignAnalytics()** - Campaign performance data
2. **getRetailerPerformance()** - Retailer rankings and metrics
3. **getUserAnalytics()** - User statistics by type/region
4. **getEmailCampaignPerformance()** - Email campaign metrics
5. **getSummaryStatistics()** - Platform overview statistics
6. **getDatabaseSchema()** - Table structure information

### **Intelligent Query Routing**
The system automatically detects user intent and fetches relevant data:

```typescript
// Retailer Performance Queries
if (userMessage.includes('retailer') && (userMessage.includes('performance') || userMessage.includes('top'))) {
  const retailerData = await databaseRAG.getRetailerPerformance({ limit: 5 });
}

// Campaign Analytics Queries  
if (userMessage.includes('campaign') && (userMessage.includes('performance') || userMessage.includes('analytics'))) {
  const campaignData = await databaseRAG.getCampaignAnalytics({ limit: 5 });
}

// User Statistics Queries
if (userMessage.includes('user') && (userMessage.includes('analytics') || userMessage.includes('statistics'))) {
  const userData = await databaseRAG.getUserAnalytics({ limit: 10 });
}
```

## 📊 Data Formatting & Presentation

### **Table Formatting Function**
```typescript
function formatDataAsTable(data: any[], title: string): string {
  const keys = Object.keys(data[0]);
  const header = `| ${keys.join(' | ')} |`;
  const separator = `|${keys.map(() => '---').join('|')}|`;
  const rows = data.map(row => `| ${keys.map(key => row[key] || 'N/A').join(' | ')} |`);
  
  return `**${title}**\n\n${header}\n${separator}\n${rows.join('\n')}`;
}
```

### **Context Injection**
Data is dynamically injected into the system prompt:
- **Document Context**: Relevant uploaded documents with similarity scores
- **Database Context**: Live query results formatted as markdown tables
- **Contextual Awareness**: System knows what data is available for each query

## 🔧 Technical Architecture

### **Frontend Components**
- **ChatBot**: Main chat interface with message handling
- **ChatInput**: Text input with send functionality
- **MessageList**: Message display with role-based styling
- **MessageRenderer**: Handles different content types (text, code, tables)
- **DocumentUpload**: File upload interface for RAG documents

### **State Management**
- **Hook**: `useChatPersistence` 
- **Storage**: SessionStorage for message persistence
- **Limits**: 100 messages maximum (memory management)
- **Welcome Message**: Predefined introduction message

### **Message Flow**
1. **User Input** → ChatInput component
2. **API Call** → `/api/chat` endpoint
3. **Intent Detection** → Automatic query routing
4. **Data Fetching** → Database + Document search
5. **Context Building** → System prompt enhancement
6. **LLM Processing** → OpenAI GPT-5-nano
7. **Streaming Response** → Real-time text display
8. **State Update** → Message persistence

## 🛡️ Security & Safety

### **Query Safety**
- **SQL Injection Prevention**: Parameterized queries only
- **Read-Only Access**: No destructive database operations
- **Service Role**: Supabase service role key for backend access
- **Input Validation**: Query safety checks in DatabaseRAGService

### **API Security**
- **Environment Variables**: Secure API key storage
- **Error Handling**: No sensitive data in error responses
- **Rate Limiting**: Handled by OpenAI API limits
- **CORS**: Proper request handling

## 📈 Performance Optimizations

### **Caching Strategy**
- **Session Storage**: Client-side message caching
- **Database Queries**: Efficient Supabase queries with limits
- **Document Search**: Vector similarity caching in database
- **Response Streaming**: Real-time text streaming for better UX

### **Resource Management**
- **Message Limits**: 100 messages maximum per session
- **Query Limits**: Configurable result limits (5-50 items)
- **Content Truncation**: Document content limited to 1500 chars
- **Connection Pooling**: Supabase handles database connections

## 🚀 Advanced Features

### **Document Q&A**
- **File Types**: TXT, MD, CSV support
- **Vector Search**: Semantic similarity matching
- **Content Analysis**: Full document content processing
- **Multi-document**: Search across multiple uploaded files

### **Database Intelligence**
- **Schema Awareness**: Knows table structures and relationships
- **Query Suggestions**: Provides helpful query alternatives
- **Data Relationships**: Understands connections between tables
- **Business Context**: Knows CrownSync domain-specific terminology

### **Contextual Responses**
- **Data-Driven**: Responses based on actual platform data
- **Document-Aware**: References specific uploaded content
- **Platform-Specific**: Tailored to CrownSync use cases
- **Multi-Modal**: Handles text, tables, and structured data

## 🔮 Disabled Features (Future Implementation)

### **Tool System (Commented Out)**
The codebase includes a comprehensive tool system that's currently disabled:

**Available Tools**:
- `searchDocuments` - Vector document search
- `queryCampaigns` - Campaign performance queries
- `queryRetailers` - Retailer performance queries  
- `queryUsers` - User analytics queries
- `queryEmailPerformance` - Email campaign metrics
- `getSummaryStatistics` - Platform statistics
- `getDatabaseSchema` - Schema information

**Reason for Disabling**: Compatibility issues that need resolution

## 🌟 Key Strengths

1. **Real-Time Data Access**: Live database integration
2. **Document Intelligence**: Vector-based document search
3. **Streaming Responses**: Real-time text generation
4. **Context Awareness**: Understands CrownSync domain
5. **Safety First**: Read-only database access with validation
6. **User-Friendly**: Natural language interface for complex queries
7. **Scalable Architecture**: Modular design for future enhancements

## 📋 Environment Requirements

```bash
# Required Environment Variables
OPENAI_API_KEY=sk-proj-...                    # OpenAI API access
NEXT_PUBLIC_SUPABASE_URL=https://...          # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...       # Backend database access
```

The current setup provides a sophisticated AI assistant with live data access, document intelligence, and streaming responses, specifically tailored for the CrownSync platform's luxury brand marketing analytics use case.