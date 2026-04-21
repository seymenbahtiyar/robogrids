/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { Documentation } from './components/Documentation';
import { Footer } from './components/Footer';
import { PrivacyPolicy, TermsAndConditions, FAQ } from './components/StaticPages';
import { JobRecord } from './types';

type ViewState = 'dashboard' | 'docs' | 'privacy' | 'terms' | 'faq';

export default function App() {
  const [data, setData] = useState<JobRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView, data]);

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
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }
    
    switch (currentView) {
      case 'docs':
        return <Documentation onBack={() => setCurrentView('dashboard')} />;
      case 'privacy':
        return <PrivacyPolicy onBack={() => setCurrentView('dashboard')} />;
      case 'terms':
        return <TermsAndConditions onBack={() => setCurrentView('dashboard')} />;
      case 'faq':
        return <FAQ onBack={() => setCurrentView('dashboard')} />;
      case 'dashboard':
      default:
        if (!data) {
          return (
            <div className="flex-grow flex items-center justify-center p-4">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
          );
        }
        return (
          <Dashboard 
            data={data} 
            onReset={handleReset} 
            onShowDocs={() => setCurrentView('docs')} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>
      <Footer onNavigate={(view) => setCurrentView(view)} />
    </div>
  );
}
