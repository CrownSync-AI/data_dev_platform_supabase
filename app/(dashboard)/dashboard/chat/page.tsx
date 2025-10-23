'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatBot } from '@/components/chat/ChatBot';
import { DocumentUpload } from '@/components/chat/DocumentUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, FileText, History, Settings, Trash2, MoreHorizontal } from 'lucide-react';
import { useChatPersistence } from '@/lib/hooks/useChatPersistence';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ChatPageContent() {
  const [activeTab, setActiveTab] = useState('chat');
  const { messages, addMessage, updateLastMessage, clearMessages, messageCount } = useChatPersistence();
  const searchParams = useSearchParams();
  const isEmbeddedMode = searchParams.get('mode') === 'embedded';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-screen flex-col">
      {/* Header */}
      <div className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isEmbeddedMode ? '' : 'ml-20'}`}>
        {/* Top Row - Title and Actions */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">AI Data Assistant</h1>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {messageCount} messages
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearMessages}
              disabled={messageCount <= 1}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <History className="h-4 w-4 mr-2" />
                  Chat History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Bottom Row - Navigation Tabs */}
        <div className="px-6 pb-3">
          <TabsList className="grid w-64 grid-cols-2 h-9">
            <TabsTrigger value="chat" className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <TabsContent value="chat" className="h-full">
          <ChatBot 
            messages={messages}
            addMessage={addMessage}
            updateLastMessage={updateLastMessage}
            messageCount={messageCount}
            isEmbeddedMode={isEmbeddedMode}
          />
        </TabsContent>

        <TabsContent value="documents" className={`h-full overflow-y-auto ${isEmbeddedMode ? 'p-8' : 'p-8 ml-20'}`}>
          <DocumentUpload />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Bot className="h-8 w-8 mx-auto text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Loading AI Assistant</p>
            <div className="page-loader" />
          </div>
        </div>
        
        <style jsx>{`
          .page-loader {
            height: 24px;
            aspect-ratio: 2;
            border-bottom: 2px solid transparent;
            background: linear-gradient(90deg, #3b82f6 50%, transparent 0) -25% 100%/50% 2px repeat-x border-box;
            position: relative;
            animation: page-loader-track 0.75s linear infinite;
            margin: 0 auto;
          }
          
          .page-loader:before {
            content: "";
            position: absolute;
            inset: auto 42.5% 0;
            aspect-ratio: 1;
            border-radius: 50%;
            background: #1d4ed8;
            animation: page-loader-ball 0.75s cubic-bezier(0, 900, 1, 900) infinite;
          }
          
          @keyframes page-loader-track {
            to {
              background-position: -125% 100%;
            }
          }
          
          @keyframes page-loader-ball {
            0%, 2% {
              bottom: 0%;
            }
            98%, 100% {
              bottom: 0.1%;
            }
          }
        `}</style>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}