import React, { useMemo } from 'react';
import { JobRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Navigation } from 'lucide-react';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';

interface RobotDurationAreaChartProps {
  data: JobRecord[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3 min-w-[150px] z-50">
        <p className="text-sm font-semibold text-slate-900 mb-1">{data.robot}</p>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-slate-500">Total Duration:</span>
          <span className="text-indigo-600 font-bold">{data.durationHours} hrs</span>
        </div>
      </div>
    );
  }
  return null;
};

export function RobotDurationAreaChart({ data }: RobotDurationAreaChartProps) {
  const chartData = useMemo(() => {
    const robotStats = new Map<string, number>();
    
    // Aggregate total duration in ms per robot
    data.forEach(job => {
      const current = robotStats.get(job.robot) || 0;
      robotStats.set(job.robot, current + job.durationMs);
    });

    // Convert map to array and format duration to hours
    const aggregated = Array.from(robotStats.entries()).map(([robot, durationMs]) => {
      return {
        robot,
        durationHours: Number((durationMs / (1000 * 60 * 60)).toFixed(2)),
      };
    });

    // Optionally sort by duration to make the area plot read slightly easier
    return aggregated.sort((a, b) => b.durationHours - a.durationHours);
  }, [data]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-slate-900">Total Duration by Robot</h2>
            <ChartInfoTooltip content="Plots every robot along the horizontal axis and their cumulative total execution duration across the entire dataset on the vertical axis." />
          </div>
          <p className="text-sm text-slate-500">Area chart mapping execution load</p>
        </div>
      </div>

      <div className="flex-1 w-full mt-2 relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 65, left: 20 }}>
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="robot" 
                name="Robot" 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                interval={0} 
                angle={-45} 
                textAnchor="end"
                dx={-2}
                dy={8}
                height={110}
                tickFormatter={(val) => val.length > 20 ? val.substring(0, 18) + '...' : val}
              />
              <YAxis 
                type="number" 
                dataKey="durationHours" 
                name="Duration (Hrs)" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickFormatter={(value) => `${value}h`}
              />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="durationHours" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDuration)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            No robot duration data found.
          </div>
        )}
      </div>
    </div>
  );
}
