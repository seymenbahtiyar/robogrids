import React, { useMemo, useState } from 'react';
import { JobRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfDay, addDays, differenceInDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Clock } from 'lucide-react';
import { Select } from './ui/Select';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';

interface UtilizationChartProps {
  data: JobRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3 min-w-[180px]">
        <p className="text-sm font-medium text-slate-900 mb-2 pb-2 border-b border-slate-100">{format(new Date(label), 'MMMM dd, yyyy')}</p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Active Time:</span>
            <span className="text-indigo-600 font-semibold">{data.hours} <span className="font-normal">hrs</span></span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Utilization:</span>
            <span className="text-slate-700 font-medium">{data.utilizationPercent}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Total Jobs:</span>
            <span className="text-slate-700 font-medium">{data.totalJobs}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function UtilizationChart({ data }: UtilizationChartProps) {
  const uniqueRobots = useMemo(() => {
    const robots = new Set(data.map(j => j.robot));
    return Array.from(robots).sort();
  }, [data]);

  const uniqueMonths = useMemo(() => {
    const months = new Set(data.map(j => format(startOfMonth(j.started), 'MMMM yyyy')));
    // Sort chronologically
    return Array.from(months).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [data]);

  const [selectedRobot, setSelectedRobot] = useState<string>(uniqueRobots[0] || '');
  const [selectedMonth, setSelectedMonth] = useState<string>(uniqueMonths[0] || '');

  const chartData = useMemo(() => {
    if (data.length === 0 || !selectedRobot || !selectedMonth) return [];

    const monthDate = new Date(selectedMonth);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Filter by robot and month
    const filteredData = data.filter(j => 
      j.robot === selectedRobot && 
      isWithinInterval(j.started, { start: monthStart, end: monthEnd })
    );

    const daysCount = differenceInDays(monthEnd, monthStart) + 1;
    
    // Initialize map for each day of the month
    const dailyStats = new Map<string, { hours: number, jobs: number }>();
    for (let i = 0; i < daysCount; i++) {
      const d = addDays(monthStart, i);
      dailyStats.set(format(d, 'yyyy-MM-dd'), { hours: 0, jobs: 0 });
    }

    // Accumulate hours and jobs
    filteredData.forEach(job => {
      const dayKey = format(startOfDay(job.started), 'yyyy-MM-dd');
      const hours = job.durationMs / (1000 * 60 * 60);
      if (dailyStats.has(dayKey)) {
        const current = dailyStats.get(dayKey)!;
        dailyStats.set(dayKey, { hours: current.hours + hours, jobs: current.jobs + 1 });
      }
    });

    return Array.from(dailyStats.entries()).map(([date, stats]) => {
      const hours = Number(stats.hours.toFixed(2));
      const utilizationPercent = Number(((hours / 24) * 100).toFixed(1));
      return {
        date,
        hours,
        totalJobs: stats.jobs,
        utilizationPercent
      };
    });
  }, [data, selectedRobot, selectedMonth]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-slate-900">Robot Utilization Timeline</h2>
              <ChartInfoTooltip content="Tracks the cumulative hours your robots spent actively executing jobs each day over the selected month." />
            </div>
            <p className="text-sm text-slate-500">Daily active hours per robot</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select 
            className="w-full sm:w-[160px]"
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={uniqueMonths.map(m => ({ value: m, label: m }))}
          />
          <Select 
            className="w-full sm:w-[220px]"
            value={selectedRobot}
            onChange={setSelectedRobot}
            options={uniqueRobots.map(r => ({ value: r, label: r }))}
          />
        </div>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            No data available for the selected criteria.
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 truncate px-2" title={selectedRobot}>
          {selectedRobot}
        </p>
      </div>
    </div>
  );
}
