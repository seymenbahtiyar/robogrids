import React, { useMemo } from 'react';
import { JobRecord } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';

interface TopFaultedRobotsChartProps {
  data: JobRecord[];
}

// A palette of clean, professional, and accessible colors with a lighter, user-friendly tone
const COLORS = [
  '#f87171', // Red 400
  '#fb923c', // Orange 400
  '#fbbf24', // Amber 400
  '#facc15', // Yellow 400
  '#a3e635', // Lime 400
  '#4ade80', // Green 400
  '#2dd4bf', // Teal 400
  '#38bdf8', // Light Blue 400
  '#818cf8', // Indigo 400
  '#c084fc'  // Purple 400
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3 min-w-[150px] z-50">
        <p className="text-sm font-semibold text-slate-900 mb-1">{payload[0].name}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Faulted Jobs:</span>
          <span className="text-rose-600 font-bold">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TopFaultedRobotsChart({ data }: TopFaultedRobotsChartProps) {
  const chartData = useMemo(() => {
    const faultedData = data.filter(j => j.state.toLowerCase() === 'faulted');
    const robotCounts: Record<string, number> = {};
    
    faultedData.forEach(j => {
      const robot = j.robot || 'Unknown Robot';
      robotCounts[robot] = (robotCounts[robot] || 0) + 1;
    });

    return Object.entries(robotCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-slate-900">Top 10 Faulted Robots</h2>
            <ChartInfoTooltip content="Identifies which specific robots are encountering the most execution faults across your infrastructure." />
          </div>
          <p className="text-sm text-slate-500">Robots with the most failed executions</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[350px] mt-2 relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                iconType="circle"
                formatter={(value: any) => {
                  const truncated = value.length > 15 ? value.substring(0, 12) + '...' : value;
                  return (
                    <span className="relative inline-block group px-1">
                      <span className="text-slate-500 font-medium cursor-help">{truncated}</span>
                      {value.length > 15 && (
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-[100] pointer-events-none border border-slate-700">
                          {value}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                        </span>
                      )}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            No faulted jobs found.
          </div>
        )}
      </div>
    </div>
  );
}
