import React from 'react';
import { Layers } from 'lucide-react';

interface FooterProps {
  onOpenUiShowcase?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenUiShowcase }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200 p-0.5 shadow-sm dark:bg-slate-700">
              <img
                src="/urban-scenery-logo.png"
                alt="Urban Scenery"
                className="w-full h-full object-cover rounded-[7px] bg-white dark:bg-slate-950"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white font-heading">
              URBAN SCENERY
            </span>
          </div>
          {onOpenUiShowcase && (
            <button
              onClick={onOpenUiShowcase}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>UI Showcase</span>
            </button>
          )}
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Urban Scenery Ventures. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            {onOpenUiShowcase && (
              <button
                onClick={onOpenUiShowcase}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>16 Interfaces Blueprint</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </footer>
  );
};
