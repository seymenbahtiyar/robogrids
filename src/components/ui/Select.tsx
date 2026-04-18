import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
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

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={cn("relative inline-block text-left w-full sm:w-auto", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full bg-white border border-slate-200 text-slate-700 py-2 pl-3.5 pr-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm cursor-pointer",
          isOpen && "border-indigo-500 ring-4 ring-indigo-500/10"
        )}
      >
        <span className="truncate mr-2">{selectedOption?.label}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 max-h-60 overflow-auto focus:outline-none",
          menuPosition === 'top' ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"
        )}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
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
          ))}
        </div>
      )}
    </div>
  );
}
