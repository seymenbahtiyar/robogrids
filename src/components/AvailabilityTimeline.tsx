import React, { useMemo, useState, useEffect } from 'react';
import { JobRecord } from '../types';
import { Clock } from 'lucide-react';
import { format, startOfDay, addDays, getHours, getMinutes, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { cn } from '../lib/utils';
import { Select } from './ui/Select';
import { ChartInfoTooltip } from './ui/ChartInfoTooltip';

interface AvailabilityTimelineProps {
  data: JobRecord[];
}

export function AvailabilityTimeline({ data }: AvailabilityTimelineProps) {
  const hasMachine = useMemo(() => data.some(j => j.machine !== undefined), [data]);
  const hasUser = useMemo(() => data.some(j => j.user !== undefined), [data]);

  const uniqueMachines = useMemo(() => ['All', ...Array.from(new Set(data.map(j => j.machine).filter(Boolean) as string[])).sort()], [data]);
  const uniqueUsers = useMemo(() => ['All', ...Array.from(new Set(data.map(j => j.user).filter(Boolean) as string[])).sort()], [data]);

  const [machineFilter, setMachineFilter] = useState<string>('All');
  const [userFilter, setUserFilter] = useState<string>('All');

  const filteredData = useMemo(() => {
    let result = data;
    if (hasMachine && machineFilter !== 'All') {
      result = result.filter(j => j.machine === machineFilter);
    }
    if (hasUser && userFilter !== 'All') {
      result = result.filter(j => j.user === userFilter);
    }
    return result;
  }, [data, hasMachine, machineFilter, hasUser, userFilter]);

  const uniqueRobots = useMemo(() => {
    const robots = new Set(filteredData.map(j => j.robot));
    return Array.from(robots).sort();
  }, [filteredData]);

  const uniqueWeeks = useMemo(() => {
    const weeks = new Set<string>(filteredData.map(j => {
      const start = startOfWeek(j.started, { weekStartsOn: 1 });
      return format(start, 'yyyy-MM-dd');
    }));
    return Array.from(weeks).sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  const [selectedRobot, setSelectedRobot] = useState<string>(uniqueRobots[0] || '');
  const [selectedWeek, setSelectedWeek] = useState<string>(uniqueWeeks[0] || '');
  
  // Keep selections valid if filters change
  useEffect(() => {
    if (uniqueRobots.length > 0 && !uniqueRobots.includes(selectedRobot)) {
      setSelectedRobot(uniqueRobots[0]);
    } else if (uniqueRobots.length === 0) {
      setSelectedRobot('');
    }
  }, [uniqueRobots, selectedRobot]);

  useEffect(() => {
    if (uniqueWeeks.length > 0 && !uniqueWeeks.includes(selectedWeek)) {
      setSelectedWeek(uniqueWeeks[0]);
    } else if (uniqueWeeks.length === 0) {
      setSelectedWeek('');
    }
  }, [uniqueWeeks, selectedWeek]);

  // Tooltip state
  const [hoveredJob, setHoveredJob] = useState<{ job: JobRecord, x: number, y: number } | null>(null);

  const timelineData = useMemo(() => {
    if (!selectedRobot || !selectedWeek || filteredData.length === 0) return { days: [], jobsByDay: {} };

    const weekStart = new Date(selectedWeek);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    const robotData = filteredData.filter(j => 
      j.robot === selectedRobot && 
      isWithinInterval(j.started, { start: weekStart, end: weekEnd })
    );

    const daysCount = 7;
    const days = [];
    const jobsByDay: Record<string, JobRecord[]> = {};

    for (let i = 0; i < daysCount; i++) {
      const d = addDays(weekStart, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      days.push(d);
      jobsByDay[dateStr] = [];
    }

    robotData.forEach(job => {
      const dateStr = format(startOfDay(job.started), 'yyyy-MM-dd');
      if (jobsByDay[dateStr]) {
        jobsByDay[dateStr].push(job);
      }
    });

    return { days, jobsByDay };
  }, [filteredData, selectedRobot, selectedWeek]);

  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'successful': return 'bg-emerald-500';
      case 'faulted': return 'bg-rose-500';
      case 'stopped': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusTextColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'successful': return 'text-emerald-600';
      case 'faulted': return 'text-rose-600';
      case 'stopped': return 'text-amber-600';
      default: return 'text-slate-600';
    }
  };

  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-slate-900">Robot Availability Timeline</h2>
              <ChartInfoTooltip content="Visualizes the precise execution blocks of individual robots throughout the day to identify long-running jobs and idle gaps." />
            </div>
            <p className="text-sm text-slate-500">Visual execution timeline per day</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
          <Select 
            className="w-full sm:w-[160px]"
            value={selectedWeek}
            onChange={setSelectedWeek}
            options={uniqueWeeks.map(w => ({ value: w, label: format(new Date(w), 'MMM dd, yyyy') }))}
          />

          {hasMachine && (
            <Select 
              className="w-full sm:w-[160px]"
              value={machineFilter}
              onChange={setMachineFilter}
              options={uniqueMachines.map(m => ({ value: m, label: m === 'All' ? 'All Machines' : m }))}
            />
          )}

          {hasUser && (
            <Select 
              className="w-full sm:w-[160px]"
              value={userFilter}
              onChange={setUserFilter}
              options={uniqueUsers.map(u => ({ value: u, label: u === 'All' ? 'All Users' : u }))}
            />
          )}

          <Select 
            className="w-full sm:w-[220px]"
            value={selectedRobot}
            onChange={setSelectedRobot}
            options={uniqueRobots.map(r => ({ value: r, label: r }))}
          />
        </div>
      </div>

      <div className="overflow-x-auto pb-4" onMouseLeave={() => setHoveredJob(null)}>
        <div className="min-w-[800px] pr-6">
          {/* Header row with hours */}
          <div className="flex ml-24 mb-2 relative h-6">
            {hours.map(hour => (
              <div key={hour} className="absolute text-xs text-slate-400 -translate-x-1/2" style={{ left: `${(hour / 24) * 100}%` }}>
                {hour}
              </div>
            ))}
          </div>

          {/* Timeline rows */}
          <div className="space-y-3">
            {timelineData.days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const jobs = timelineData.jobsByDay[dateStr] || [];

              return (
                <div key={dateStr} className="flex items-center h-10">
                  <div className="w-24 flex-shrink-0 pr-4 text-right">
                    <div className="text-sm font-medium text-slate-700">{format(day, 'EEE')}</div>
                    <div className="text-xs text-slate-500">{format(day, 'MMM dd')}</div>
                  </div>
                  
                  <div className="flex-grow h-8 bg-slate-50 rounded-md relative border border-slate-100">
                    {/* Grid lines */}
                    {hours.slice(0, 24).map(hour => (
                      <div key={hour} className="absolute top-0 bottom-0 border-l border-slate-200" style={{ left: `${(hour / 24) * 100}%` }} />
                    ))}

                    {/* Job blocks */}
                    {jobs.map(job => {
                      const startHour = getHours(job.started) + getMinutes(job.started) / 60;
                      const endHour = getHours(job.ended) + getMinutes(job.ended) / 60;
                      
                      // Handle jobs that cross midnight (simplified: cap at 24)
                      const actualEndHour = endHour < startHour ? 24 : endHour;
                      
                      const leftPercent = (startHour / 24) * 100;
                      const widthPercent = ((actualEndHour - startHour) / 24) * 100;

                      // Ensure minimum width for visibility
                      const minWidth = Math.max(widthPercent, 0.5);

                      return (
                        <div
                          key={job.id}
                          className={cn("absolute top-1 bottom-1 rounded-sm opacity-90 hover:opacity-100 cursor-pointer transition-opacity", getStatusColor(job.state))}
                          style={{ left: `${leftPercent}%`, width: `${minWidth}%` }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredJob({
                              job,
                              x: rect.left + rect.width / 2,
                              y: rect.top
                            });
                          }}
                          onMouseMove={(e) => {
                            setHoveredJob(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                          }}
                          onMouseLeave={() => setHoveredJob(null)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {timelineData.days.length === 0 && (
              <div className="text-center py-8 text-slate-400">No timeline data available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span className="text-xs text-slate-600">Other</span>
        </div>
      </div>

      {/* Custom Tooltip */}
      {hoveredJob && (
        <div 
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3"
          style={{ left: hoveredJob.x, top: hoveredJob.y }}
        >
          <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 truncate pr-4">{hoveredJob.job.process}</span>
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-slate-50", getStatusTextColor(hoveredJob.job.state))}>
                {hoveredJob.job.state}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Started:</span>
                <span className="text-slate-700 font-medium">{format(hoveredJob.job.started, 'HH:mm:ss')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Ended:</span>
                <span className="text-slate-700 font-medium">{format(hoveredJob.job.ended, 'HH:mm:ss')}</span>
              </div>
              <div className="flex justify-between text-xs mt-1 pt-1 border-t border-slate-100">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-700 font-medium">
                  {Math.round(hoveredJob.job.durationMs / 1000 / 60)} mins
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 truncate px-2" title={selectedRobot}>
          {selectedRobot}
        </p>
      </div>
    </div>
  );
}
