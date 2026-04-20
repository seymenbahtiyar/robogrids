import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  menuPosition?: 'top' | 'bottom';
}

export function Select({ value, onChange, options, className, menuPosition = 'bottom' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNode, setHoveredNode] = useState<{ label: string, top: number, left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setSearchQuery(''), 200);
      setHoveredNode(null);
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent, label: string) => {
    setHoveredNode({
      label,
      top: e.clientY + 15,
      left: e.clientX + 15
    });
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={cn("relative inline-block text-left w-full sm:w-auto", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseMove={(e) => selectedOption?.label && handleMouseMove(e, selectedOption.label)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex items-center justify-between w-full bg-white border border-slate-200 text-slate-700 py-2 pl-3.5 pr-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm cursor-pointer",
          isOpen && "border-indigo-500 ring-4 ring-indigo-500/10"
        )}
      >
        <span className="truncate mr-2">{selectedOption?.label}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 max-h-[300px] flex flex-col focus:outline-none",
          menuPosition === 'top' ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"
        )}>
          <div className="px-2 pb-1.5 mb-1 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          
          <div className="overflow-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="py-2 px-3 text-sm text-slate-500 text-center">No results found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onMouseMove={(e) => handleMouseMove(e, option.label)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setHoveredNode(null);
                  }}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm transition-colors mx-1 rounded-md",
                    option.value === value 
                      ? "bg-indigo-50 text-indigo-700 font-medium" 
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span className="block truncate">{option.label}</span>
                  {option.value === value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Custom Tooltip */}
      {hoveredNode && (
        <div 
          className="fixed z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          style={{ left: hoveredNode.left, top: hoveredNode.top }}
        >
          <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-2.5 max-w-[300px]">
            <p className="text-xs font-semibold text-slate-900 break-words">{hoveredNode.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
