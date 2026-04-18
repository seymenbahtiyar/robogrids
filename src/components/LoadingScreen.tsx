import React, { useState, useEffect } from 'react';
import { Loader2, Activity, BarChart3, Settings } from 'lucide-react';

const loadingSteps = [
  { text: "Parsing execution data...", icon: Activity },
  { text: "Calculating utilization metrics...", icon: Settings },
  { text: "Generating dashboard...", icon: BarChart3 },
];

export function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = loadingSteps[stepIndex].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center max-w-sm w-full">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-indigo-50 p-4 rounded-full text-indigo-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Processing Data</h2>
        
        <div className="flex items-center gap-2 text-slate-500 h-6 overflow-hidden">
          <CurrentIcon className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300" key={stepIndex}>
            {loadingSteps[stepIndex].text}
          </span>
        </div>
        
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((stepIndex + 1) / loadingSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
