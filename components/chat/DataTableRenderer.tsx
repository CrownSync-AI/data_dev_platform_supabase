'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableRendererProps {
  content: string;
}

export function DataTableRenderer({ content }: DataTableRendererProps) {
  // Simple markdown table parser
  const lines = content.split('\n').filter(line => line.trim());
  const tableLines = lines.filter(line => line.includes('|'));
  
  if (tableLines.length < 2) {
    // Not a valid table, render as regular content
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  const headerLine = tableLines[0];
  const separatorLine = tableLines[1];
  const dataLines = tableLines.slice(2);

  // Parse header
  const headers = headerLine
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell);

  // Parse data rows
  const rows = dataLines.map(line => 
    line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell)
  );

  // Filter out any non-table content
  const beforeTable = content.split(tableLines[0])[0];
  const afterTableIndex = content.lastIndexOf(tableLines[tableLines.length - 1]);
  const afterTable = content.slice(afterTableIndex + tableLines[tableLines.length - 1].length);

  return (
    <div className="space-y-3">
      {beforeTable.trim() && (
        <div className="whitespace-pre-wrap">{beforeTable.trim()}</div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="font-medium">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="text-sm">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {afterTable.trim() && (
        <div className="whitespace-pre-wrap">{afterTable.trim()}</div>
      )}
    </div>
  );
}