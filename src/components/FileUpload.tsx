import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, AlertCircle, Download } from 'lucide-react';
import { JobRecord } from '../types';
import { generateDemoCsv } from '../lib/demoData';

interface FileUploadProps {
  onDataLoaded: (data: JobRecord[]) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [robotColumn, setRobotColumn] = useState<'Host Identity' | 'Hostname'>('Host Identity');

  const processFiles = (files: File[]) => {
    setError(null);
    
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
                const robot = row[robotColumn]; // Treat selected column as Robot
                const state = row['State'];
                const startedStr = row['Started (absolute)'];
                const endedStr = row['Ended (absolute)'];

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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-12 mb-20 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
          <UploadCloud className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">Robogrids</h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Upload your RPA execution CSV files to generate a comprehensive dashboard. All processing happens locally in your browser.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">1. Select Robot Identifier</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all duration-200 ${robotColumn === 'Host Identity' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
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
                    <span className={`mt-1 flex items-center text-sm ${robotColumn === 'Host Identity' ? 'text-indigo-700' : 'text-slate-500'}`}>Use the Host Identity column to group robots.</span>
                  </span>
                </span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${robotColumn === 'Host Identity' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'} mt-0.5`}>
                  {robotColumn === 'Host Identity' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all duration-200 ${robotColumn === 'Hostname' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
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
                    <span className={`mt-1 flex items-center text-sm ${robotColumn === 'Hostname' ? 'text-indigo-700' : 'text-slate-500'}`}>Use the Hostname column to group robots.</span>
                  </span>
                </span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${robotColumn === 'Hostname' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'} mt-0.5`}>
                  {robotColumn === 'Hostname' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">2. Upload Data</h3>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`w-full p-10 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer group
                ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <div className={`p-4 rounded-full mb-4 transition-colors duration-200 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">
                Click to upload <span className="text-slate-500 font-normal">or drag and drop files</span>
              </p>
              <p className="text-sm text-slate-500">CSV files only</p>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                multiple
                className="hidden"
                onChange={onFileInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Need some test data?</span> Download a sample file to try it out.
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleDownloadDemo('hostIdentity')}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Host Identity Demo
              </button>
              <button 
                onClick={() => handleDownloadDemo('hostname')}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Hostname Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start text-rose-700 w-full shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
