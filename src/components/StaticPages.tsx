import React from 'react';
import { ArrowLeft, Shield, FileText, HelpCircle } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  icon: React.ElementType;
  onBack: () => void;
  children: React.ReactNode;
}

const PageLayout = ({ title, icon: Icon, onBack, children }: PageLayoutProps) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 w-full flex-grow">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors group cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back
    </button>
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
        <Icon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
    </div>
    <div className="space-y-8 text-slate-600 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      {children}
    </div>
  </div>
);

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <PageLayout title="Privacy Policy" icon={Shield} onBack={onBack}>
      <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Data Processing</h3>
        <p>Robogrids processes all CSV data locally within your web browser. We do not upload, store, or transmit your UiPath job execution data to any external servers or third-party services. Your data remains completely private and secure on your device.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Information Collection</h3>
        <p>We do not collect personal information, telemetry, or analytics usage data from our users while using the dashboard visualization features.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Third-party Content</h3>
        <p>Our dashboard generates visual charts using numerical calculations derived from your local data. No data is shared with the charting libraries or any external analytical infrastructure.</p>
      </section>
      
      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Security</h3>
        <p>Because all logic executes exclusively inside your local environment ecosystem via JavaScript, your data's security profile maps inherently identically to the baseline physical security state of your immediate workstation or browser profile sandbox.</p>
      </section>
    </PageLayout>
  );
}

export function TermsAndConditions({ onBack }: { onBack: () => void }) {
  return (
    <PageLayout title="Terms and Conditions" icon={FileText} onBack={onBack}>
      <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h3>
        <p>By accessing and using Robogrids, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this application.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Use License</h3>
        <p>Robogrids is provided as a client-side utility for visualizing RPA job data. The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Limitations</h3>
        <p>In no event shall Robogrids, its developers, or its contributors be liable for any claim, damages, or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.</p>
      </section>
      
      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Application Usage Constraints</h3>
        <p>Since the application processes CSV execution logs heavily inside your browser’s physical random-access memory (RAM), very large datasets may induce local instability. You inherently assume the responsibility of resource management within your respective hardware limit tolerances.</p>
      </section>
    </PageLayout>
  );
}

export function FAQ({ onBack }: { onBack: () => void }) {
  return (
    <PageLayout title="Frequently Asked Questions" icon={HelpCircle} onBack={onBack}>
      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Where is my data stored?</h4>
          <p className="text-slate-600">Nowhere! All parsing, calculations, and chart rendering are performed directly inside your local browser cache environment. Once you refresh or close the tab, your data is completely wiped from memory. We do not maintain any databases or servers that store your execution histories.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">What format should my CSV be?</h4>
          <p className="text-slate-600">The application is built deliberately to consume the standard CSV export exactly as it comes out of the UiPath Orchestrator "Jobs" page. Do not strip or alter the default header structure (such as 'Process', 'Robot', 'State', 'Started', 'Ended').</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">How are the utilization metrics calculated?</h4>
          <p className="text-slate-600">Utilization is measured by aggregating the absolute running time of jobs against the theoretical 24-hour maximum capacity parameters over the dataset's chronological span. You can read the precise mathematical formulas by clicking the "Docs" button up on the dashboard action bar!</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Can I export the dashboard?</h4>
          <p className="text-slate-600">Yes! You can use the "Screenshot" button on the top right header of the dashboard module to instantly render and download a high-resolution PNG image capturing your charts. Perfect for slapping it directly into a presentation or reporting slide.</p>
        </div>
      </div>
    </PageLayout>
  );
}
