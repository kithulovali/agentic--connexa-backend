import React from 'react';
import { Sparkles, Shield, Cpu, RefreshCw, Heart, Layers } from 'lucide-react';

interface FooterProps {
  onOpenUiShowcase?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenUiShowcase }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200 p-0.5 shadow-sm dark:bg-slate-700">
                <img
                  src="/urban-scenery-logo.png"
                  alt="Urban Scenery Ventures"
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
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Metropolitan AI-powered e-commerce ecosystem specializing in high-performance electronics, hardware devices, and enterprise business intelligence.
            </p>
          </div>

          {/* Core Hardware Categories */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono tracking-wider mb-3">
              Hardware Systems
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Laptops & Workstations</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Smartphones & Handhelds</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Audio & Noise-Cancelling</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Displays & 4K Monitors</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Cables & Power Hubs</li>
            </ul>
          </div>

          {/* AI Services */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono tracking-wider mb-3">
              Autonomous AI Rails
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="hover:text-brand-500 transition-colors cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-accent-500" />
                <span>AI Smart Search</span>
              </li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Shopping Advisor Agent</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Business Intelligence BI</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Image Studio Generator</li>
              <li className="hover:text-brand-500 transition-colors cursor-pointer">Social Campaign Publisher</li>
            </ul>
          </div>

          {/* Operational Status */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono tracking-wider mb-3">
              Cloud Infrastructure
            </h4>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Backend API:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-200 dark:border-brand-500/30">
                  FASTAPI 1.0.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Host:</span>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold">Render Cloud</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Database:</span>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold">SQLite / PostgreSQL</span>
              </div>
            </div>
          </div>
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
            <span>Official Electronics Storefront & Back-Office Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
