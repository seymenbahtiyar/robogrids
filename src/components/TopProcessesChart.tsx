import React, { useMemo } from 'react';
import { JobRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ListOrdered } from 'lucide-react';
import { cn } from '../lib/utils';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';

interface TopProcessesChartProps {
  data: JobRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3 min-w-[200px] z-50">
        <p className="text-sm font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">{payload[0].payload.name}</p>
        <div className="flex flex-col gap-1.5 mb-2">
          {payload.map((entry: any, index: number) => (
            entry.value > 0 && (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-500">{entry.name}:</span>
                </div>
                <span className="text-slate-900 font-medium">{entry.value}</span>
              </div>
            )
          ))}
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-semibold">
          <span className="text-slate-700">Total:</span>
          <span className="text-slate-900">{total}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TopProcessesChart({ data }: TopProcessesChartProps) {
  const chartData = useMemo(() => {
    const processStats: Record<string, { total: number, Successful: number, Faulted: number, Stopped: number }> = {};

    data.forEach(job => {
      const pName = job.process;
      if (!processStats[pName]) {
        processStats[pName] = { total: 0, Successful: 0, Faulted: 0, Stopped: 0 };
      }
      
      processStats[pName].total += 1;
      
      const state = job.state.toLowerCase();
      if (state === 'successful') processStats[pName].Successful += 1;
      else if (state === 'faulted') processStats[pName].Faulted += 1;
      else if (state === 'stopped') processStats[pName].Stopped += 1;
    });

    const sortedProcesses = Object.entries(processStats)
      .map(([name, stats]) => ({
        name,
        // Truncate names for Y-axis display to prevent layout issues
        displayName: name.length > 15 ? name.substring(0, 12) + '...' : name,
        ...stats
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return sortedProcesses;
  }, [data]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <ListOrdered className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-slate-900">Top 10 Processes</h2>
            <ChartInfoTooltip content="Highlights the highest-volume processes executed by your fleet, segmented by execution success and failure rates." />
          </div>
          <p className="text-sm text-slate-500">Execution volume breakdown by final status</p>
        </div>
      </div>

      <div className="h-[400px] w-full mt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="displayName" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                width={140}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              
              <Bar dataKey="Successful" stackId="a" fill="#10b981" isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
              <Bar dataKey="Faulted" stackId="a" fill="#f43f5e" isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
              <Bar dataKey="Stopped" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">No data available.</div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-slate-600">Successful</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-rose-500" />
          <span className="text-xs text-slate-600">Faulted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-xs text-slate-600">Stopped</span>
        </div>
      </div>
    </div>
  );
}
