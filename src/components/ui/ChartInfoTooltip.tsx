import React from 'react';
import { Info } from 'lucide-react';

interface ChartInfoTooltipProps {
  content: string;
}

export function ChartInfoTooltip({ content }: ChartInfoTooltipProps) {
  return (
    <div className="relative flex items-center group ml-2">
      <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-800 text-slate-100 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}
