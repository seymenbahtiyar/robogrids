import React, { useMemo, useState } from 'react';
import { JobRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import { Select } from './ui/Select';
import { MultiSelect } from './ui/MultiSelect';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';
import { format } from 'date-fns';

interface ProcessDurationChartProps {
  data: JobRecord[];
}

const METRIC_OPTIONS = [
  { value: 'Average', label: 'Average Duration' },
  { value: 'Total', label: 'Total Duration' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3 min-w-[200px] z-50 relative">
        <p className="text-sm font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-500">{entry.name}:</span>
              </div>
              <span className="text-slate-900 font-medium">{entry.value} mins</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ProcessDurationChart({ data }: ProcessDurationChartProps) {
  const uniqueMonths = useMemo(() => {
    const months = new Set(data.map(j => format(j.started, 'yyyy-MM')));
    return ['All', ...Array.from(months).sort().reverse()];
  }, [data]);

  const uniqueProcesses = useMemo(() => {
    const processes = new Set(data.map(j => j.process));
    return ['Top 10', ...Array.from(processes).sort()];
  }, [data]);

  const [selectedProcess, setSelectedProcess] = useState<string>('Top 10');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Average', 'Total']);

  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    let filteredData = data;
    
    if (selectedMonth !== 'All') {
      filteredData = filteredData.filter(j => format(j.started, 'yyyy-MM') === selectedMonth);
    }

    const dataToGroup = selectedProcess === 'Top 10' 
      ? filteredData 
      : filteredData.filter(j => j.process === selectedProcess);

    // Group by process
    const processGroups: Record<string, number[]> = {};
    
    dataToGroup.forEach(job => {
      if (!processGroups[job.process]) {
        processGroups[job.process] = [];
      }
      processGroups[job.process].push(job.durationMs / (1000 * 60)); // in minutes
    });

    let result = Object.entries(processGroups).map(([process, durations]) => {
      const count = durations.length;
      const total = durations.reduce((acc, val) => acc + val, 0);
      const average = total / count;

      return {
        process,
        Average: Number(average.toFixed(1)),
        Total: Number(total.toFixed(1))
      };
    });

    // Sort appropriately
    result.sort((a, b) => {
      if (selectedMetrics.includes('Average') && !selectedMetrics.includes('Total')) {
        return b.Average - a.Average;
      }
      if (selectedMetrics.includes('Total') && !selectedMetrics.includes('Average')) {
        return b.Total - a.Total;
      }
      // If both or neither, default to sorting by Average
      return b.Average - a.Average;
    });
    
    if (selectedProcess === 'Top 10') {
      result = result.slice(0, 10);
    }

    return result;

  }, [data, selectedProcess, selectedMonth, selectedMetrics]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 h-full flex flex-col">
      <div className="flex flex-col justify-between items-start mb-6 gap-4">
        <div className="flex items-center gap-3 w-full">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-slate-900">Process Duration</h2>
              <ChartInfoTooltip content="Shows the selected duration metrics (in minutes) for processes to help identify performance bottlenecks and overall time consumption." />
            </div>
            <p className="text-sm text-slate-500">Duration metrics (minutes)</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
          <MultiSelect
            className="w-full sm:w-[150px]"
            value={selectedMetrics}
            onChange={setSelectedMetrics}
            options={METRIC_OPTIONS}
            placeholder="Select metrics"
          />
          <Select 
            className="w-full sm:w-[160px]"
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={uniqueMonths.map(m => {
              if (m === 'All') return { value: 'All', label: 'All Time' };
              const [y, mo] = m.split('-');
              return {
                value: m,
                label: format(new Date(Number(y), Number(mo) - 1), 'MMMM yyyy')
              };
            })}
          />
          <Select 
            className="w-full sm:w-[260px] flex-1"
            value={selectedProcess}
            onChange={setSelectedProcess}
            options={uniqueProcesses.map(p => ({ value: p, label: p === 'Top 10' ? 'Top 10 Processes' : p }))}
          />
        </div>
      </div>

      <div className="h-[300px] w-full mt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="process" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
                tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              {selectedMetrics.length > 0 && (
                <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
              )}
              {selectedMetrics.includes('Total') && (
                <Bar name="Total" dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
              )}
              {selectedMetrics.includes('Average') && (
                <Bar name="Average" dataKey="Average" fill="#38bdf8" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">No data available or no metrics selected.</div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 truncate px-2" title={selectedProcess === 'Top 10' ? 'Top 10 Processes' : selectedProcess}>
          {selectedProcess === 'Top 10' ? 'Top 10 Processes' : selectedProcess}
        </p>
      </div>
    </div>
  );
}
