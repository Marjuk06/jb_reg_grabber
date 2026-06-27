import React from 'react';
import Image from 'next/image';
import { Database, DownloadCloud, Loader2 } from 'lucide-react';
import JBLogo from '@/assets/JB_logo.jpeg';

interface DatabaseSyncSectionProps {
  onSync: () => Promise<void>;
  isLoading: boolean;
  progress: number;
  hasData: boolean;
}

export default function DatabaseSyncSection({ onSync, isLoading, progress, hasData }: DatabaseSyncSectionProps) {
  const loadingStrings = [
    "Establishing secure link...",
    "Bypassing firewall...",
    "Connecting to Jessore Board...",
    "Authenticating credentials...",
    "Accessing central database...",
    "Downloading student records...",
    "Decrypting payload...",
    "Finalizing sync..."
  ];
  
  // Prevent index out of bounds if progress is exactly 100
  const loadingIndex = Math.min(Math.floor((progress / 100) * loadingStrings.length), loadingStrings.length - 1);
  const loadingText = loadingStrings[loadingIndex >= 0 ? loadingIndex : 0];

  return (
    <div className="bg-[#050b14] md:bg-black/60 md:backdrop-blur-2xl border border-blue-600/25 rounded-2xl md:shadow-2xl p-5 flex flex-col md:flex-row gap-4 shrink-0 justify-between items-center relative overflow-hidden">
      {isLoading && (
        <div 
          className="absolute left-0 top-0 h-full bg-emerald-500/10 transition-all duration-300 ease-out z-0"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-2 text-left w-full md:w-auto">
        <div className="flex flex-row items-center gap-3 md:gap-4">
          <div className="flex-shrink-0 bg-white/5 p-1 rounded-2xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Image src={JBLogo} alt="Jessore Board Logo" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Master Student<br className="md:hidden" /> Dashboard
          </h1>
        </div>
        <p className="text-[11px] md:text-xs text-emerald-500/70">
          Viewing live data synchronized from Jessore Board Central Database.
        </p>
      </div>

      <div className="flex items-center justify-end gap-4 w-full md:w-auto relative z-10 mt-2 md:mt-0">
        <div className={`flex items-center gap-3 border rounded-xl px-4 py-2 w-full md:w-auto ${isLoading ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}>
          <div className="relative flex h-3 w-3 shrink-0">
            {isLoading ? (
               <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute -left-[2px] -top-[2px]" />
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            )}
          </div>
          <div className="flex flex-col w-full overflow-hidden">
            <span className={`text-[9px] md:text-[10px] font-bold tracking-widest uppercase ${isLoading ? 'text-cyan-300' : 'text-emerald-300'}`}>
              {isLoading ? 'System Status' : 'Connection Status'}
            </span>
            <span className={`text-[10px] md:text-xs font-mono truncate ${isLoading ? 'text-cyan-100/70' : 'text-emerald-100/70'}`}>
              {isLoading ? loadingText : 'Jessore Board Database Connected'}
            </span>
          </div>
          {isLoading && <span className="text-cyan-400 font-bold text-xs ml-2 shrink-0">{Math.round(progress)}%</span>}
        </div>
      </div>
    </div>
  );
}
