'use client';

import { ToolInvocation } from 'ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, FileText, Users, TrendingUp, BarChart3, Mail } from 'lucide-react';

interface ToolInvocationRendererProps {
  invocations: ToolInvocation[];
}

export function ToolInvocationRenderer({ invocations }: ToolInvocationRendererProps) {
  return (
    <div className="space-y-3">
      {invocations.map((invocation) => (
        <ToolInvocationCard key={invocation.toolCallId} invocation={invocation} />
      ))}
    </div>
  );
}

function ToolInvocationCard({ invocation }: { invocation: ToolInvocation }) {
  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'searchDocuments':
        return FileText;
      case 'queryCampaigns':
        return TrendingUp;
      case 'queryRetailers':
        return Users;
      case 'queryUsers':
        return Users;
      case 'queryEmailPerformance':
        return Mail;
      case 'getSummaryStatistics':
        return BarChart3;
      case 'getDatabaseSchema':
        return Database;
      default:
        return Database;
    }
  };

  const getToolTitle = (toolName: string) => {
    switch (toolName) {
      case 'searchDocuments':
        return 'Document Search';
      case 'queryCampaigns':
        return 'Campaign Query';
      case 'queryRetailers':
        return 'Retailer Query';
      case 'queryUsers':
        return 'User Query';
      case 'queryEmailPerformance':
        return 'Email Performance';
      case 'getSummaryStatistics':
        return 'Summary Statistics';
      case 'getDatabaseSchema':
        return 'Database Schema';
      default:
        return 'Tool Execution';
    }
  };

  const Icon = getToolIcon(invocation.toolName);

  if (invocation.state === 'call') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4" />
            {getToolTitle(invocation.toolName)}
            <Loader2 className="h-3 w-3 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">Executing...</p>
        </CardContent>
      </Card>
    );
  }

  if (invocation.state === 'result') {
    const result = invocation.result;
    
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4" />
            {getToolTitle(invocation.toolName)}
            <Badge variant="secondary" className="text-xs">
              {result.success ? 'Success' : 'Error'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ToolResultRenderer result={result} toolName={invocation.toolName} />
        </CardContent>
      </Card>
    );
  }

  return null;
}

function ToolResultRenderer({ result, toolName }: { result: any; toolName: string }) {
  // Handle null or undefined result
  if (!result || typeof result !== 'object') {
    return (
      <div className="text-red-600 text-xs">
        Error: Invalid result data
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="text-red-600 text-xs">
        Error: {result.error || 'Unknown error occurred'}
      </div>
    );
  }

  switch (toolName) {
    case 'searchDocuments':
      return (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Found {result.found} relevant documents
          </p>
          {result.documents?.slice(0, 3).map((doc: any, index: number) => (
            <div key={index} className="border-l-2 border-blue-300 pl-2">
              <p className="font-medium text-xs">{doc.title}</p>
              <p className="text-xs text-muted-foreground">
                Similarity: {(doc.similarity * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      );

    case 'queryCampaigns':
    case 'queryRetailers':
    case 'queryUsers':
    case 'queryEmailPerformance':
      return (
        <div className="text-xs text-muted-foreground">
          Retrieved {result.rowCount || result.data?.length || 0} records
        </div>
      );

    case 'getSummaryStatistics':
      return (
        <div className="text-xs text-muted-foreground">
          Generated platform summary statistics
        </div>
      );

    case 'getDatabaseSchema':
      return (
        <div className="text-xs text-muted-foreground">
          Found {result.total_tables} database tables
        </div>
      );

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Tool executed successfully
        </div>
      );
  }
}