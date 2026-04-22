import React, { useMemo, useState } from 'react';
import { JobRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Select } from './ui/Select';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CompletedJobsTimelineProps {
  data: JobRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3 min-w-[200px] z-50 relative">
        <p className="text-sm font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-500">{entry.name}:</span>
              </div>
              <span className="text-slate-900 font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function CompletedJobsTimeline({ data }: CompletedJobsTimelineProps) {
  const uniqueMonths = useMemo(() => {
    const months = new Set(data.map(j => format(j.ended, 'yyyy-MM')));
    return Array.from(months).sort();
  }, [data]);

  const uniqueProcesses = useMemo(() => {
    const processes = new Set(data.map(j => j.process));
    return ['All Processes', ...Array.from(processes).sort()];
  }, [data]);

  const [selectedMonth, setSelectedMonth] = useState<string>(uniqueMonths[0] || format(new Date(), 'yyyy-MM'));
  const [selectedProcess, setSelectedProcess] = useState<string>('All Processes');

  // Ensure default state falls back perfectly when dataset switches
  React.useEffect(() => {
    if (uniqueMonths.length > 0 && !uniqueMonths.includes(selectedMonth)) {
      setSelectedMonth(uniqueMonths[0]);
    }
  }, [uniqueMonths, selectedMonth]);

  const chartData = useMemo(() => {
    if (!selectedMonth || data.length === 0) return [];

    const [year, month] = selectedMonth.split('-');
    const monthDate = new Date(Number(year), Number(month) - 1, 1);
    
    const days = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate)
    });

    const dailyCounts: Record<string, { Successful: number, Faulted: number, Stopped: number }> = {};
    
    days.forEach(d => {
      dailyCounts[format(d, 'yyyy-MM-dd')] = { Successful: 0, Faulted: 0, Stopped: 0 };
    });

    data.forEach(job => {
      const jobMonth = format(job.ended, 'yyyy-MM');
      const processName = job.process;
      
      const isMonthMatch = jobMonth === selectedMonth;
      const isProcessMatch = selectedProcess === 'All Processes' || processName === selectedProcess;

      if (isMonthMatch && isProcessMatch) {
        const dayKey = format(job.ended, 'yyyy-MM-dd');
        if (dailyCounts[dayKey]) {
          const state = job.state.toLowerCase();
          if (state === 'successful') dailyCounts[dayKey].Successful += 1;
          else if (state === 'faulted') dailyCounts[dayKey].Faulted += 1;
          else if (state === 'stopped') dailyCounts[dayKey].Stopped += 1;
        }
      }
    });

    return days.map(d => {
      const dateStr = format(d, 'yyyy-MM-dd');
      return {
        dateStr,
        displayDate: format(d, 'MMM dd'),
        ...dailyCounts[dateStr]
      };
    });
  }, [data, selectedMonth, selectedProcess]);

  const monthLabel = useMemo(() => {
    if (!selectedMonth) return '';
    const [year, month] = selectedMonth.split('-');
    return format(new Date(Number(year), Number(month) - 1), 'MMMM yyyy');
  }, [selectedMonth]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-slate-900 truncate">Completed Jobs Timeline</h2>
              <ChartInfoTooltip content="Displays the daily volume of jobs over a month, categorized by outcome to track operational stability over time." />
            </div>
            <p className="text-sm text-slate-500 truncate">Daily execution volume by final state</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Select 
            className="w-full sm:w-[200px]"
            value={selectedProcess}
            onChange={setSelectedProcess}
            options={uniqueProcesses.map(p => ({
              value: p,
              label: p
            }))}
          />
          <Select 
            className="w-full sm:w-[180px]"
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={uniqueMonths.map(m => {
              const [y, mo] = m.split('-');
              return {
                value: m,
                label: format(new Date(Number(y), Number(mo) - 1), 'MMMM yyyy')
              };
            })}
          />
        </div>
      </div>

      <div className="h-[300px] w-full mt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Successful" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
              <Line type="monotone" dataKey="Faulted" stroke="#f43f5e" strokeWidth={2} dot={{ r: 2, fill: '#f43f5e', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
              <Line type="monotone" dataKey="Stopped" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">No data available for this month.</div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-600">Successful</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs text-slate-600">Faulted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-slate-600">Stopped</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 truncate px-2" title={monthLabel}>
          {monthLabel}
        </p>
      </div>
    </div>
  );
}
