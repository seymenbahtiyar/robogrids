import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  className?: string;
  menuPosition?: 'top' | 'bottom';
  placeholder?: string;
}

export function MultiSelect({ value, onChange, options, className, menuPosition = 'bottom', placeholder = 'Select...' }: MultiSelectProps) {
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

  const getDisplayValue = () => {
    if (!value || value.length === 0) return placeholder;
    if (value.length === options.length) return 'All Selected';
    return value.map(v => options.find(o => o.value === v)?.label).join(', ');
  };

  const handleToggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

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
        <span className="truncate mr-2 max-w-[150px]">{getDisplayValue()}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 max-h-60 overflow-auto focus:outline-none",
          menuPosition === 'top' ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"
        )}>
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className={cn(
                  "relative cursor-pointer select-none py-2 pl-3 pr-4 text-sm transition-colors mx-1 rounded-md flex items-center",
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className={cn(
                  "mr-2 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                )}>
                  {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                </div>
                <span className="block truncate">{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
