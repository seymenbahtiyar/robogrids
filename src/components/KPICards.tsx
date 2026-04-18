import React, { useEffect, useState } from 'react';
import { JobRecord } from '../types';
import { LayoutGrid, CheckCircle2, AlertCircle, Clock, Cpu, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';

interface KPICardsProps {
  data: JobRecord[];
}

function AnimatedNumber({ value }: { value: number | string }) {
  const isPercent = typeof value === 'string' && value.endsWith('%');
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace('%', '')) 
    : value;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Optional: if data is empty or 0, just set directly
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;
    const durationMs = 500; // Same 500ms optimization as the Recharts modifications

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / durationMs, 1);
      
      // easeOutCubic for a smooth drop-in
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      
      setDisplayValue(numericValue * easeOut);

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [numericValue]);

  if (isPercent) {
    return <>{displayValue.toFixed(1)}%</>;
  }

  // Integers
  return <>{Math.round(displayValue)}</>;
}

export function KPICards({ data }: KPICardsProps) {
  const totalJobs = data.length;
  const successfulJobs = data.filter(j => j.state === 'Successful').length;
  const faultedJobs = data.filter(j => j.state === 'Faulted').length;
  const stoppedJobs = data.filter(j => j.state === 'Stopped').length;
  
  const successRate = totalJobs > 0 ? ((successfulJobs / totalJobs) * 100).toFixed(1) : '0.0';
  
  const uniqueProcesses = new Set(data.map(j => j.process)).size;
  const uniqueRobots = new Set(data.map(j => j.robot)).size;

  const cards = [
    {
      title: 'Total Jobs',
      value: totalJobs,
      icon: LayoutGrid,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconBg: 'bg-white',
      tooltip: 'The total absolute volume of jobs processed across your entire fleet.'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      iconBg: 'bg-white',
      tooltip: 'The percentage of jobs that completed their execution cycle successfully without throwing an unhandled core exception.'
    },
    {
      title: 'Faulted',
      value: faultedJobs,
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      iconBg: 'bg-white',
      tooltip: 'The total volume of jobs that crashed critically and failed to finish.'
    },
    {
      title: 'Stopped',
      value: stoppedJobs,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      iconBg: 'bg-white',
      tooltip: 'Jobs that were manually halted by an administrator or hit a pre-defined maximum timeout threshold.'
    },
    {
      title: 'Processes',
      value: uniqueProcesses,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      iconBg: 'bg-white',
      tooltip: 'The distinct number of unique RPA workflow processes currently active within the platform.'
    },
    {
      title: 'Robots',
      value: uniqueRobots,
      icon: Cpu,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      iconBg: 'bg-white',
      tooltip: 'The distinct count of virtual/physical robot agents currently assigned to process workload.'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={cn(
            "rounded-xl border p-4 flex flex-col justify-between shadow-sm",
            card.bgColor,
            card.borderColor
          )}
        >
          <div className="flex justify-between items-start mb-2 group">
            <span className="text-sm font-medium text-slate-600 flex items-center relative cursor-help">
              {card.title}
              <div className="absolute top-full left-0 mt-2 w-48 p-2.5 bg-slate-800 text-slate-100 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {card.tooltip}
              </div>
            </span>
            <div className={cn("p-1.5 rounded-md shadow-sm", card.iconBg)}>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </div>
          </div>
          <div className={cn("text-2xl font-bold", card.color)}>
            <AnimatedNumber value={card.value} />
          </div>
        </div>
      ))}
    </div>
  );
}
