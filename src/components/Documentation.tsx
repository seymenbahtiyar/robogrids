import React from 'react';
import { ArrowLeft, BookOpen, BarChart3, Clock, AlertTriangle, Activity, PieChart, CalendarDays, Calculator } from 'lucide-react';

interface DocumentationProps {
  onBack: () => void;
}

export function Documentation({ onBack }: DocumentationProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documentation & Formulas</h1>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            This guide details how every metric, chart, and value is mathematically aggregated and calculated within the Robogrids dashboard framework.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* KPI Cards */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">KPI Summary Cards</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Jobs</h3>
                  <p className="text-sm text-slate-600 mb-2">The total number of job records successfully parsed from your data source.</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                    Count(All Parsed Rows)
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Success Rate</h3>
                  <p className="text-sm text-slate-600 mb-2">The percentage of total jobs that reached a "Successful" state safely.</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                    (Count(Successful) / Total Jobs) × 100
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Faulted / Stopped</h3>
                  <p className="text-sm text-slate-600 mb-2">The raw counts of jobs that ended in Faulted or Stopped states.</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                    Count(State === 'Faulted' | 'Stopped')
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Unique Entities</h3>
                  <p className="text-sm text-slate-600 mb-2">The distinct number of unique Processes and standard Robots logged.</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                    Count(Distinct Processes | Robots)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Duration Chart */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Activity className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Process Duration</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Evaluates execution times per unique process, filtered globally or independently by robot. Identifies performance bottlenecks by comparing Average and Total durations:
            </p>
            <ul className="list-disc list-inside space-y-4 text-slate-600 ml-2">
              <li>
                <strong className="text-slate-800">Average Duration:</strong> The mean minutes it takes Process X to complete.
                <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 block ml-6">
                  Avg = ∑(Durations for Process X) / Count(Process X)
                </div>
              </li>
              <li>
                <strong className="text-slate-800">Total Duration:</strong> Total minutes of processing power consumed by Process X globally.
                <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 block ml-6">
                  Total = ∑(Durations for Process X)
                </div>
              </li>
            </ul>
          </section>

          {/* Utilization Charts */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Robot Utilization Metrics</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Tracks actual workload capacity by analyzing absolute uptime against a 24-hour physical maximum boundary.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Utilization Pie Chart</h3>
                <p className="text-sm text-slate-600 mb-2">Compares total active operation boundaries vs. unutilized potential across the entire lifespan of the dataset.</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 space-y-1">
                  <p className="text-slate-500">// 1. Determine Lifespan</p>
                  <p>Days Span = (Maximum Global End Date - Minimum Global Start Date) + 1</p>
                  <p className="text-slate-500 mt-2">// 2. Calculate Max Theoretical Hours</p>
                  <p>Possible Hours = Days Span × 24 × (Number of Selected Robots)</p>
                  <p className="text-slate-500 mt-2">// 3. Extrapolate Final Metric</p>
                  <p>Total Utilization % = (∑(Active Robot Hours) / Possible Hours) × 100</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Daily Utilization Bar Chart</h3>
                <p className="text-sm text-slate-600 mb-2">Maps a robot's active utilization day over day across a selected month. Useful for viewing physical capacity caps per 24 hours.</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                  <p>Daily Active Time = ∑(Duration of jobs recorded on Day D)</p>
                  <p>Daily Utilization % = (Daily Active Time / 24 hours) × 100</p>
                </div>
              </div>
            </div>
          </section>

          {/* Top Processes & Faulted Robots */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <PieChart className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Volume & Fault Analysis</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 mb-2">Top 10 Processes</h3>
                <p className="text-sm text-slate-600 mb-2">A volume-based ranking of the most frequently executed processes. They are then segmented internally by ending state (Successful, Faulted, Stopped).</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                  Ranked By = Descending Order of Count(Process executions)
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Top 10 Faulted Robots
                </h3>
                <p className="text-sm text-slate-600 mb-2">Isolates all executions strictly carrying the 'Faulted' terminal condition. Groups and counts them aggressively by robot to target failing environment clusters.</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                  Fault Aggregation = Count(Jobs where State == 'Faulted' mapped by Robot)
                </div>
              </div>
            </div>
          </section>

          {/* Timelines */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <CalendarDays className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Temporal Timelines</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Completed Jobs Timeline</h3>
                <p className="text-sm text-slate-600 mb-2">Aggregates pure execution volume by day over a selected month calendar, breaking down the raw frequencies into outcome cohorts (Success vs. Failures vs. Stops).</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                  Point[Daily Date] = Aggregate Count(Jobs reaching End date overlapping Current Daily Date)
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Robot Availability Timeline (Execution Gantt)</h3>
                <p className="text-sm text-slate-600 mb-2">A high-density Gantt deployment matrix charting the absolute, continuous start-to-end execution window of independent jobs across all 24 hours of a 7-day week view per Robot.</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                  <li><strong>Green Plot:</strong> A successful start-to-end execution span visually scaled relative to its precise minutes/hours over the 24-hour track.</li>
                  <li><strong>Red/Yellow Plot:</strong> Anomalous execution behavior marking exactly when faults or stops triggered.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
