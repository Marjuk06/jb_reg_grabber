import React, { useState } from 'react';
import { Database, DownloadCloud, Loader2 } from 'lucide-react';

interface DatabaseSyncSectionProps {
  onSync: () => Promise<void>;
  isLoading: boolean;
  progress: number;
}

export default function DatabaseSyncSection({ onSync, isLoading, progress }: DatabaseSyncSectionProps) {
  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-blue-600/25 rounded-2xl shadow-2xl p-5 flex flex-col md:flex-row gap-4 shrink-0 justify-between items-center relative overflow-hidden">
      {isLoading && (
        <div 
          className="absolute left-0 top-0 h-full bg-emerald-500/10 transition-all duration-300 ease-out z-0"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative z-10 text-center md:text-left w-full md:w-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Master Student Dashboard
        </h1>
        <p className="text-xs text-emerald-500/70 mt-2 md:mt-1">
          Viewing live data synchronized from Jessore Board Central Database.
        </p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-4 py-2 hidden md:flex">
          <Database className="text-cyan-400" size={20} />
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-300 font-bold tracking-widest uppercase">Connection Status</span>
            <span className="text-xs text-cyan-100/70 font-mono">Jessore Board Linked</span>
          </div>
        </div>

        <button 
          onClick={onSync}
          disabled={isLoading}
          className={`relative z-10 w-full md:w-auto py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] tracking-widest flex items-center justify-center gap-2 border ${
            isLoading 
              ? 'bg-emerald-500/40 border-emerald-500 text-white cursor-wait'
              : 'bg-emerald-600/20 hover:bg-emerald-500/40 border-emerald-500/50 text-emerald-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Syncing... {Math.round(progress)}%
            </>
          ) : (
            <>
              <DownloadCloud size={20} />
              Sync from Database
            </>
          )}
        </button>
      </div>
    </div>
  );
}
