import React from 'react';

export const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <span className="font-semibold text-slate-800 dark:text-slate-200">URBAN SCENERY</span>
      <span>© {new Date().getFullYear()}</span>
    </div>
  </footer>
);
