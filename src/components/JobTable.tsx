import React, { useMemo, useState } from 'react';
import { JobRecord } from '../types';
import { format } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Select } from './ui/Select';

interface JobTableProps {
  data: JobRecord[];
}

type SortField = 'process' | 'robot' | 'state' | 'started' | 'ended';
type SortOrder = 'asc' | 'desc';

export function JobTable({ data }: JobTableProps) {
  const [search, setSearch] = useState('');
  const [processFilter, setProcessFilter] = useState('All');
  const [robotFilter, setRobotFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  
  const [sortField, setSortField] = useState<SortField>('started');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const uniqueProcesses = useMemo(() => ['All', ...Array.from(new Set(data.map(j => j.process))).sort()], [data]);
  const uniqueRobots = useMemo(() => ['All', ...Array.from(new Set(data.map(j => j.robot))).sort()], [data]);
  const uniqueStates = useMemo(() => ['All', ...Array.from(new Set(data.map(j => j.state))).sort()], [data]);

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    // Filters
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(j => 
        j.process.toLowerCase().includes(lowerSearch) || 
        j.robot.toLowerCase().includes(lowerSearch)
      );
    }
    if (processFilter !== 'All') result = result.filter(j => j.process === processFilter);
    if (robotFilter !== 'All') result = result.filter(j => j.robot === robotFilter);
    if (stateFilter !== 'All') result = result.filter(j => j.state === stateFilter);

    // Sorting
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'process': comparison = a.process.localeCompare(b.process); break;
        case 'robot': comparison = a.robot.localeCompare(b.robot); break;
        case 'state': comparison = a.state.localeCompare(b.state); break;
        case 'started': comparison = a.started.getTime() - b.started.getTime(); break;
        case 'ended': comparison = a.ended.getTime() - b.ended.getTime(); break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, search, processFilter, robotFilter, stateFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (state: string) => {
    switch (state.toLowerCase()) {
      case 'successful':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Successful</span>;
      case 'faulted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Faulted</span>;
      case 'stopped':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Stopped</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{state}</span>;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />;
    return <ArrowUpDown className={cn("w-3 h-3 ml-1", sortOrder === 'asc' ? 'text-indigo-600' : 'text-indigo-600 rotate-180')} />;
  };

  const startItem = filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredAndSortedData.length);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Job Execution Details</h2>
        
        <div className="flex flex-wrap gap-4 items-start">
          <div className="relative flex-grow min-w-[280px] w-full xl:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search processes or robots..."
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm hover:border-slate-300 bg-white"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 pb-2 lg:pb-0 w-full xl:w-auto flex-1">
            <Select 
              className="min-w-[160px]"
              value={processFilter}
              onChange={(val) => { setProcessFilter(val); setCurrentPage(1); }}
              options={uniqueProcesses.map(p => ({ value: p, label: p === 'All' ? 'All Processes' : p }))}
            />
            
            <Select 
              className="min-w-[150px]"
              value={robotFilter}
              onChange={(val) => { setRobotFilter(val); setCurrentPage(1); }}
              options={uniqueRobots.map(r => ({ value: r, label: r === 'All' ? 'All Robots' : r }))}
            />
            
            <Select 
              className="min-w-[140px]"
              value={stateFilter}
              onChange={(val) => { setStateFilter(val); setCurrentPage(1); }}
              options={uniqueStates.map(s => ({ value: s, label: s === 'All' ? 'All States' : s }))}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('process')}>
                <div className="flex items-center">Process <SortIcon field="process" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('robot')}>
                <div className="flex items-center">Robot <SortIcon field="robot" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('state')}>
                <div className="flex items-center">State <SortIcon field="state" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('started')}>
                <div className="flex items-center">Started <SortIcon field="started" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" onClick={() => handleSort('ended')}>
                <div className="flex items-center">Ended <SortIcon field="ended" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{job.process}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.robot}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getStatusBadge(job.state)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(job.started, 'yyyy-MM-dd HH:mm:ss')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(job.ended, 'yyyy-MM-dd HH:mm:ss')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  No execution records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span>Items</span>
            <Select 
              value={itemsPerPage.toString()}
              onChange={(val) => {
                setItemsPerPage(Number(val));
                setCurrentPage(1);
              }}
              options={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' }
              ]}
              className="w-20"
              menuPosition="top"
            />
          </div>
          <div className="text-slate-500">
            {startItem} - {endItem} / {filteredAndSortedData.length}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          
          <span className="text-sm text-slate-600 min-w-[80px] text-center">
            Page {currentPage} / {Math.max(1, totalPages)}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
