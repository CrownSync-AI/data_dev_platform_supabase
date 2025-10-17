'use client';

import { useState } from 'react';
import { ChatBot } from '@/components/chat/ChatBot';
import { DocumentUpload } from '@/components/chat/DocumentUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, FileText, History, Settings, Trash2 } from 'lucide-react';
import { useChatPersistence } from '@/lib/hooks/useChatPersistence';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const { messages, addMessage, updateLastMessage, clearMessages, messageCount } = useChatPersistence();

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-8 py-4 ml-20">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Data Assistant
          </h1>
          <p className="text-muted-foreground text-sm">
            Ask questions about your data, upload documents, or get platform help - database queries included!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messageCount} messages
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearMessages}
            disabled={messageCount <= 1}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-8 py-2 ml-20">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 mt-0 pb-20">
            <ChatBot 
              messages={messages}
              addMessage={addMessage}
              updateLastMessage={updateLastMessage}
              messageCount={messageCount}
            />
          </TabsContent>

          <TabsContent value="documents" className="flex-1 mt-0 p-8 pb-20 ml-20">
            <DocumentUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}