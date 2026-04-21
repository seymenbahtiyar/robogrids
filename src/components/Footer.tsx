import React from 'react';

interface FooterProps {
  onNavigate: (view: 'privacy' | 'terms' | 'faq') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full py-6 mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <div>&copy; {new Date().getFullYear()} Robogrids. All rights reserved.</div>
        <div className="flex gap-6">
          <button onClick={() => onNavigate('faq')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            FAQ
          </button>
          <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 transition-colors cursor-pointer">
            Terms & Conditions
          </button>
        </div>
      </div>
    </footer>
  );
}
