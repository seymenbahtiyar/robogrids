import React, { useRef, useState } from 'react';
import { JobRecord } from '../types';
import { TotalUtilizationChart } from './TotalUtilizationChart';
import { ProcessDurationChart } from './ProcessDurationChart';
import { CompletedJobsTimeline } from './CompletedJobsTimeline';
import { AvailabilityTimeline } from './AvailabilityTimeline';
import { TopProcessesChart } from './TopProcessesChart';
import { TopFaultedRobotsChart } from './TopFaultedRobotsChart';
import { RobotDurationAreaChart } from './RobotDurationAreaChart';
import { JobTable } from './JobTable';
import { LogOut, SquareChartGantt, Camera, BookOpen } from 'lucide-react';
import { KPICards } from './KPICards';
import { UtilizationChart } from './UtilizationChart';
import * as htmlToImage from 'html-to-image';

interface DashboardProps {
  data: JobRecord[];
  onReset: () => void;
  onShowDocs: () => void;
}

export function Dashboard({ data, onReset, onShowDocs }: DashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // ... (screenshot and return wrappers)
  const handleDownloadScreenshot = async () => {
    if (!dashboardRef.current) return;
    try {
      setIsCapturing(true);
      // Give a tiny delay for any hover states or transitions to clear
      await new Promise((resolve) => setTimeout(resolve, 150));
      const dataUrl = await htmlToImage.toPng(dashboardRef.current, { 
        cacheBust: true,
        backgroundColor: '#f8fafc', // match tailwind slate-50
        pixelRatio: 2 // High-res capture
      });
      const link = document.createElement('a');
      link.download = `robogrids-dashboard-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download screenshot', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans" ref={dashboardRef}>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 data-html2canvas-ignore">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg ring-4 ring-indigo-50">
              <SquareChartGantt className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Robogrids</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                  Dashboard
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Overview of robot performance and job statuses</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <button 
              onClick={onShowDocs}
              className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Docs</span>
            </button>
            <button 
              onClick={handleDownloadScreenshot}
              disabled={isCapturing}
              className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{isCapturing ? 'Capturing...' : 'Screenshot'}</span>
            </button>
            <button 
              onClick={onReset}
              className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Load New Data</span>
            </button>
          </div>
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
          <RobotDurationAreaChart data={data} />
          <UtilizationChart data={data} />
          <CompletedJobsTimeline data={data} />
          <AvailabilityTimeline data={data} />
        </div>
        
        <JobTable data={data} />
      </div>
    </div>
  );
}
