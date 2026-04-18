/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { JobRecord } from './types';

export default function App() {
  const [data, setData] = useState<JobRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = (parsedData: JobRecord[]) => {
    setIsLoading(true);
    // Enforce a minimum 3-second loading animation
    setTimeout(() => {
      setData(parsedData);
      setIsLoading(false);
    }, 3000);
  };

  const handleReset = () => {
    setData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {isLoading ? (
        <LoadingScreen />
      ) : !data ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <FileUpload onDataLoaded={handleDataLoaded} />
        </div>
      ) : (
        <Dashboard data={data} onReset={handleReset} />
      )}
    </div>
  );
}
