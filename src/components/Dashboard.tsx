import React from 'react';
import { JobRecord } from '../types';
import { TotalUtilizationChart } from './TotalUtilizationChart';
import { ProcessDurationChart } from './ProcessDurationChart';
import { CompletedJobsTimeline } from './CompletedJobsTimeline';
import { AvailabilityTimeline } from './AvailabilityTimeline';
import { TopProcessesChart } from './TopProcessesChart';
import { TopFaultedRobotsChart } from './TopFaultedRobotsChart';
import { JobTable } from './JobTable';
import { LogOut } from 'lucide-react';
import { KPICards } from './KPICards';
import { UtilizationChart } from './UtilizationChart';

interface DashboardProps {
  data: JobRecord[];
  onReset: () => void;
}

export function Dashboard({ data, onReset }: DashboardProps) {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Robogrids <span className="text-slate-400 font-medium font-sans px-2">|</span> Execution Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of robot performance and job statuses</p>
          </div>
          <button 
            onClick={onReset}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Load New Data
          </button>
        </header>

        <KPICards data={data} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProcessDurationChart data={data} />
          <TotalUtilizationChart data={data} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TopProcessesChart data={data} />
          <TopFaultedRobotsChart data={data} />
        </div>

        <div className="flex flex-col gap-6 mb-6">
          <UtilizationChart data={data} />
          <CompletedJobsTimeline data={data} />
          <AvailabilityTimeline data={data} />
        </div>
        
        <JobTable data={data} />
      </div>
    </div>
  );
}
