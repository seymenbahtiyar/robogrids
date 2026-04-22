import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, AlertCircle, Download, SquareChartGantt, Play, Info, FileDown, Clock, MousePointerClick, Github, Bot, Database, Activity, FileText, Terminal, BarChart3, PieChart, Cpu, LineChart, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { JobRecord } from '../types';
import { generateDemoCsv } from '../lib/demoData';
import { howtoImageBase64 as howtoImage } from '../images/howto';
import { Dialog } from './ui/Dialog';

interface FileUploadProps {
  onDataLoaded: (data: JobRecord[]) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [robotColumn, setRobotColumn] = useState<'Host Identity' | 'Hostname'>('Host Identity');
  const [showGuide, setShowGuide] = useState(false);

  // ... (processFiles, onDragOver, etc functions remain same)

  const processFiles = (files: File[], columnOverride?: 'Host Identity' | 'Hostname') => {
    setError(null);
    const activeColumn = columnOverride || robotColumn;
    
    // Create a promise for each file that resolves with its parsed JobRecords
    const filePromises = files.map((file) => {
      return new Promise<JobRecord[]>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const parsedData: JobRecord[] = results.data.map((row: any, index: number) => {
                // Extract required columns based on the prompt
                const process = row['Process'];
                const robot = row[activeColumn]; // Treat selected column as Robot
                const state = row['State'];
                const startedStr = row['Started (absolute)'];
                const endedStr = row['Ended (absolute)'];
                const hostnameVal = row['Hostname'];
                const hostIdentityVal = row['Host Identity'];

                let machine: string | undefined = undefined;
                let user: string | undefined = undefined;

                if (activeColumn === 'Host Identity') {
                  machine = hostnameVal;
                } else if (activeColumn === 'Hostname') {
                  user = hostIdentityVal;
                }

                if (!process || !state || !startedStr || !endedStr) {
                  throw new Error(`Missing required fields in row ${index + 1} of ${file.name}`);
                }

                const started = new Date(startedStr);
                const ended = new Date(endedStr);
                const durationMs = ended.getTime() - started.getTime();

                return {
                  id: row['Key'] || `${file.name}-row-${index}`, // Fallback ID if Key is missing, utilizing the filename for uniqueness
                  process,
                  robot: robot || 'Unknown Robot', // Handle empty robot names
                  state,
                  started,
                  ended,
                  durationMs,
                  machine,
                  user
                };
              });
              resolve(parsedData);
            } catch (err: any) {
              reject(err.message || `Failed to parse CSV data in ${file.name}.`);
            }
          },
          error: (error) => {
            reject(`Error reading ${file.name}: ${error.message}`);
          }
        });
      });
    });

    Promise.all(filePromises)
      .then((allDataArrays) => {
        // Flatten the array of arrays into a single dataset
        const flatData = allDataArrays.flat();
        if (flatData.length === 0) {
          setError("The uploaded files appear to be empty or invalid.");
          return;
        }
        onDataLoaded(flatData);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = (Array.from(e.dataTransfer.files) as File[]).filter((file: File) => file.type === 'text/csv' || file.name.endsWith('.csv'));
      if (filesArray.length > 0) {
        processFiles(filesArray);
      } else {
        setError("Please upload valid CSV files.");
      }
    }
  }, [robotColumn]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      processFiles(filesArray);
    }
  };

  const handleDownloadDemo = (type: 'hostIdentity' | 'hostname') => {
    const csvContent = generateDemoCsv(type);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `demo_data_${type}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadDemo = (type: 'hostIdentity' | 'hostname') => {
    const csvContent = generateDemoCsv(type);
    const file = new File([csvContent], `demo_data_${type}.csv`, { type: 'text/csv' });
    const col = type === 'hostIdentity' ? 'Host Identity' : 'Hostname';
    setRobotColumn(col);
    processFiles([file], col);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 h-full relative">
      
      {/* Left Animated Visuals */}
      <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-12 pointer-events-none opacity-80 z-0">
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-indigo-500"><Bot className="w-6 h-6" /></motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-emerald-500 ml-8"><Database className="w-8 h-8" /></motion.div>
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-rose-500"><Activity className="w-6 h-6" /></motion.div>
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-amber-500 ml-4"><Terminal className="w-7 h-7" /></motion.div>
      </div>

      {/* Right Animated Visuals */}
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-12 pointer-events-none opacity-80 z-0">
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-purple-500 mr-4"><BarChart3 className="w-7 h-7" /></motion.div>
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-500"><PieChart className="w-6 h-6" /></motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2.5 }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-teal-500 mr-8"><Cpu className="w-8 h-8" /></motion.div>
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }} className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-orange-500"><Settings className="w-6 h-6" /></motion.div>
      </div>

      <div className="text-center mb-6 mt-4 relative w-full z-10">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-md ring-2 ring-indigo-50">
            <SquareChartGantt className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
            Upload Center
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Robogrids</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Upload your RPA execution CSV files to generate a comprehensive dashboard. All processing happens locally in your browser.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 mt-4">
          <button 
            onClick={() => setShowGuide(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm focus:outline-none cursor-pointer group"
          >
            <Info className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            How do I get my UiPath CSV?
          </button>
          
          <a
            href="https://github.com/seymenbahtiyar/robogrids"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm focus:outline-none cursor-pointer group"
          >
            <Github className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
            ⭐ Star us on GitHub
          </a>
        </div>

        <Dialog 
          isOpen={showGuide} 
          onClose={() => setShowGuide(false)}
          title="Exporting Jobs from UiPath Orchestrator"
        >
          <div className="flex flex-col gap-6">
            <div className="w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-4 shadow-sm">
              <img 
                src={howtoImage} 
                alt="How to export jobs from UiPath Orchestrator" 
                className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md bg-white ml-2"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-start p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className="absolute -top-2 -left-2 w-7 h-7 bg-indigo-600 text-white text-sm font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">1</div>
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                  <Play className="w-5 h-5" />
                  <span className="font-bold text-sm">Automations</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Navigate to the main Automations tab in your top navigation menu.</p>
              </div>
              <div className="flex flex-col items-start p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className="absolute -top-2 -left-2 w-7 h-7 bg-indigo-600 text-white text-sm font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">2</div>
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                  <MousePointerClick className="w-5 h-5" />
                  <span className="font-bold text-sm">Jobs</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Click on the Jobs sub-menu to view the historical robot execution log.</p>
              </div>
              <div className="flex flex-col items-start p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className="absolute -top-2 -left-2 w-7 h-7 bg-indigo-600 text-white text-sm font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">3</div>
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-sm">Creation Time</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Set the Creation Time filter to include a wide range (e.g. Last 6 months).</p>
              </div>
              <div className="flex flex-col items-start p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative">
                <div className="absolute -top-2 -left-2 w-7 h-7 bg-indigo-600 text-white text-sm font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">4</div>
                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                  <FileDown className="w-5 h-5" />
                  <span className="font-bold text-sm">Export</span>
                </div>
                <p className="text-xs text-indigo-800/80 leading-relaxed">Click the Export button to download the historical CSV directly to your machine.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong className="font-bold">Pro tip:</strong> Have multiple Orchestrator folders? 
                Download the CSV from each folder, then select and upload them all simultaneously here. You can aggregate and consolidate data from all folders into a single dashboard view!
              </p>
            </div>
            
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-300"
            >
              Close Guide
            </button>
          </div>
        </Dialog>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative z-0">
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Configuration & Help */}
          <div className="flex flex-col flex-1 h-full max-h-full">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">1. Select Robot Identifier</h3>
            <div className="flex flex-col gap-3">
              <label className={`relative flex cursor-pointer rounded-xl border p-3 focus:outline-none transition-all duration-200 ${robotColumn === 'Host Identity' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                <input 
                  type="radio" 
                  name="robotColumn" 
                  value="Host Identity" 
                  checked={robotColumn === 'Host Identity'}
                  onChange={(e) => setRobotColumn(e.target.value as any)}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className={`block text-sm font-medium ${robotColumn === 'Host Identity' ? 'text-indigo-900' : 'text-slate-900'}`}>Host Identity</span>
                    <span className={`mt-0.5 flex items-center text-xs ${robotColumn === 'Host Identity' ? 'text-indigo-700' : 'text-slate-500'}`}>Groups robots by Host Identity column.</span>
                  </span>
                </span>
                <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${robotColumn === 'Host Identity' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'} mt-0.5`}>
                  {robotColumn === 'Host Identity' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-xl border p-3 focus:outline-none transition-all duration-200 ${robotColumn === 'Hostname' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                <input 
                  type="radio" 
                  name="robotColumn" 
                  value="Hostname" 
                  checked={robotColumn === 'Hostname'}
                  onChange={(e) => setRobotColumn(e.target.value as any)}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className={`block text-sm font-medium ${robotColumn === 'Hostname' ? 'text-indigo-900' : 'text-slate-900'}`}>Hostname</span>
                    <span className={`mt-0.5 flex items-center text-xs ${robotColumn === 'Hostname' ? 'text-indigo-700' : 'text-slate-500'}`}>Groups robots by Hostname column.</span>
                  </span>
                </span>
                <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${robotColumn === 'Hostname' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'} mt-0.5`}>
                  {robotColumn === 'Hostname' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </label>
            </div>
          </div>

          {/* Right Column: Dropzone */}
          <div className="flex flex-col flex-1 h-full min-h-[220px]">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">2. Upload Data</h3>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`w-full h-full flex-grow border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer group min-h-[160px]
                ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <div className={`p-3 rounded-full mb-3 transition-colors duration-200 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-base font-medium text-slate-900 mb-1 text-center px-4">
                Click to upload <span className="text-slate-500 font-normal">or drop files</span>
              </p>
              <p className="text-xs text-slate-500">CSV files only</p>
              <input
                id="csv-upload"
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel,application/csv,text/plain"
                multiple
                className="hidden"
                onChange={onFileInputChange}
              />
            </div>
          </div>
        </div>
        
        {/* Compact Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Want to see it in action?</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleLoadDemo('hostIdentity')}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  Run Host Identity Demo
                </button>
                <button 
                  onClick={() => handleLoadDemo('hostname')}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  Run Hostname Demo
                </button>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-slate-200 h-10"></div>
            
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Need test data?</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownloadDemo('hostIdentity')}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Host Identity CSV
                </button>
                <button 
                  onClick={() => handleDownloadDemo('hostname')}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Hostname CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start text-rose-700 w-full max-w-lg shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
