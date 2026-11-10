import React from 'react';
import { Sparkles, Shield, Cpu, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5">
                <img
                  src="/urban-scenery-logo.png"
                  alt="Urban Scenery Ventures"
                  className="w-full h-full object-cover rounded-[7px] bg-slate-950"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-bold text-sm text-white">Urban Scenery Ventures</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Metropolitan AI-powered e-commerce ecosystem specializing in high-performance electronics, hardware devices, and enterprise business intelligence.
            </p>
          </div>

          {/* Core Hardware Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase font-mono tracking-wider mb-3">
              Hardware Systems
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">Laptops & Workstations</li>
              <li className="hover:text-white transition-colors cursor-pointer">Smartphones & Handhelds</li>
              <li className="hover:text-white transition-colors cursor-pointer">Audio & Noise-Cancelling</li>
              <li className="hover:text-white transition-colors cursor-pointer">Displays & 4K Monitors</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cables & Power Hubs</li>
            </ul>
          </div>

          {/* AI Services */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase font-mono tracking-wider mb-3">
              Autonomous AI Rails
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>AI Smart Search</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">Shopping Advisor Agent</li>
              <li className="hover:text-white transition-colors cursor-pointer">Business Intelligence BI</li>
              <li className="hover:text-white transition-colors cursor-pointer">Image Studio Generator</li>
              <li className="hover:text-white transition-colors cursor-pointer">Social Campaign Publisher</li>
            </ul>
          </div>

          {/* Operational Status */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase font-mono tracking-wider mb-3">
              Cloud Infrastructure
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Backend API:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  FASTAPI 1.0.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Host:</span>
                <span className="text-[10px] font-mono text-slate-300">Render Cloud</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Database:</span>
                <span className="text-[10px] font-mono text-slate-300">SQLite / PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Urban Scenery Ventures. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for high-performance e-commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

