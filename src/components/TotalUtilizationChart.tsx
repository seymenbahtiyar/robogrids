import React, { useMemo, useState } from 'react';
import { JobRecord } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Select } from './ui/Select';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';
import { differenceInDays, startOfDay } from 'date-fns';

interface TotalUtilizationChartProps {
  data: JobRecord[];
}

export function TotalUtilizationChart({ data }: TotalUtilizationChartProps) {
  const uniqueRobots = useMemo(() => {
    const robots = new Set(data.map(j => j.robot));
    return ['All', ...Array.from(robots).sort()];
  }, [data]);

  const [selectedRobot, setSelectedRobot] = useState<string>('All');

  const { chartData, utilizationPercent, activeHours, possibleHours } = useMemo(() => {
    if (data.length === 0) {
      return { chartData: [], utilizationPercent: 0, activeHours: 0, possibleHours: 0 };
    }

    const minDate = startOfDay(new Date(Math.min(...data.map(d => d.started.getTime()))));
    const maxDate = startOfDay(new Date(Math.max(...data.map(d => d.ended.getTime()))));
    const totalDays = differenceInDays(maxDate, minDate) + 1;

    const filteredData = selectedRobot === 'All' 
      ? data 
      : data.filter(j => j.robot === selectedRobot);

    const activeMs = filteredData.reduce((sum, job) => sum + job.durationMs, 0);
    const activeHoursCalc = activeMs / (1000 * 60 * 60);

    const robotCount = selectedRobot === 'All' ? uniqueRobots.length - 1 : 1;
    const possibleHoursCalc = totalDays * 24 * robotCount;
    
    const idleHoursCalc = Math.max(0, possibleHoursCalc - activeHoursCalc);
    const percent = possibleHoursCalc > 0 ? (activeHoursCalc / possibleHoursCalc) * 100 : 0;

    return {
      activeHours: activeHoursCalc,
      possibleHours: possibleHoursCalc,
      utilizationPercent: percent.toFixed(1),
      chartData: [
        { name: 'Active', value: activeHoursCalc, color: '#6366f1' }, // indigo-500
        { name: 'Idle', value: idleHoursCalc, color: '#f1f5f9' } // slate-100
      ]
    };
  }, [data, selectedRobot, uniqueRobots.length]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3 min-w-[140px] z-50 relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-sm font-medium text-slate-900">{data.name} Time</span>
          </div>
          <div className="text-slate-600 text-sm pl-5">
            {data.value.toFixed(1)} hours
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col h-full">
      <div className="flex flex-col justify-between items-start mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-slate-900">Total Utilization</h2>
              <ChartInfoTooltip content="Compares the sum of active robot execution hours against the total theoretically available 24/7 capacity." />
            </div>
            <p className="text-sm text-slate-500">Overall active vs idle time</p>
          </div>
        </div>
        
        <Select 
          className="w-full sm:w-[200px]"
          value={selectedRobot}
          onChange={setSelectedRobot}
          options={uniqueRobots.map(r => ({ value: r, label: r === 'All' ? 'All Robots' : r }))}
        />
      </div>

      <div className="flex-grow flex items-center justify-center relative min-h-[250px] w-full">
        {chartData.length > 0 ? (
          <>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-4xl font-bold text-slate-900 tracking-tight">
                {utilizationPercent}%
              </span>
              <span className="text-sm font-medium text-slate-500 mt-1">
                Utilized
              </span>
            </div>

            <div className="absolute inset-0 z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    stroke="none"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive={true}
                    animationDuration={500}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-slate-400">No data available.</div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-slate-500 mb-1">Total Possible</span>
          <span className="font-semibold text-slate-900">{possibleHours.toFixed(0)} hrs</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-slate-500 mb-1">Total Active</span>
          <span className="font-semibold text-indigo-600">{activeHours.toFixed(1)} hrs</span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-400 truncate px-2" title={selectedRobot === 'All' ? 'All Robots' : selectedRobot}>
          {selectedRobot === 'All' ? 'All Robots' : selectedRobot}
        </p>
      </div>
    </div>
  );
}
