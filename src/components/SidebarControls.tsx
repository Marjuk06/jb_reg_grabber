import React, { useState } from 'react';
import { SortMode, GenderFilter, GroupFilter } from './types';

import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface SidebarControlsProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentSort: SortMode;
  setCurrentSort: (s: SortMode) => void;
  genderFilter: GenderFilter;
  setGenderFilter: (g: GenderFilter) => void;
  groupFilter: GroupFilter;
  setGroupFilter: (g: GroupFilter) => void;
  recordCount: number;
  onExport: () => void;
  onReset: () => void;
  hasData: boolean;
}

export default function SidebarControls(props: SidebarControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const btnClass = (active: boolean, colorClass: string = 'text-emerald-300') => 
    `py-2 text-[11px] font-bold rounded-xl border transition-all ${
      active 
        ? 'bg-emerald-500/25 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        : `bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/40 ${colorClass}`
    }`;

  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-blue-600/25 rounded-2xl shadow-2xl p-4 lg:p-5 flex flex-col gap-5 shrink-0 w-full lg:w-[320px] lg:overflow-y-auto sticky top-4 z-40 max-h-[90vh]">
      
      {/* Search and Mobile Toggle Header */}
      <div className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Search Reg, Name, Roll..."
          value={props.searchQuery}
          onChange={e => props.setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 text-xs bg-emerald-500/5 border border-emerald-500/20 rounded-xl color-white outline-none focus:border-emerald-500/50 focus:bg-emerald-500/10 placeholder:text-emerald-500/50 transition-all text-white"
        />
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-[11px] font-bold tracking-widest uppercase"
        >
          <span>Filters & Controls</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expandable Content */}
      <div className={`${isExpanded ? 'flex' : 'hidden'} lg:flex flex-col gap-5 flex-grow`}>

      {/* Sorting */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold ml-1">Sort By</span>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => props.setCurrentSort('boardRoll')} className={btnClass(props.currentSort === 'boardRoll')}>Board Roll</button>
          <button onClick={() => props.setCurrentSort('serial')} className={btnClass(props.currentSort === 'serial')}>Seat Plan</button>
          <button onClick={() => props.setCurrentSort('roll')} className={`col-span-2 ${btnClass(props.currentSort === 'roll')}`}>Class Roll</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold ml-1">Filter Gender</span>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => props.setGenderFilter(props.genderFilter === 'Female' ? null : 'Female')} className={btnClass(props.genderFilter === 'Female', 'text-pink-300')}>Female</button>
          <button onClick={() => props.setGenderFilter(props.genderFilter === 'Male' ? null : 'Male')} className={btnClass(props.genderFilter === 'Male', 'text-cyan-300')}>Male</button>
        </div>

        <span className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold ml-1 mt-2">Filter Group</span>
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => props.setGroupFilter(props.groupFilter === 'Science' ? null : 'Science')} className={btnClass(props.groupFilter === 'Science', 'text-purple-300')}>Science</button>
          <button onClick={() => props.setGroupFilter(props.groupFilter === 'Humanities' ? null : 'Humanities')} className={btnClass(props.groupFilter === 'Humanities', 'text-yellow-300')}>Humanities</button>
          <button onClick={() => props.setGroupFilter(props.groupFilter === 'Business' ? null : 'Business')} className={btnClass(props.groupFilter === 'Business', 'text-emerald-300')}>Business</button>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-emerald-500/20">
        <div className="flex justify-between items-center text-sm px-1">
          <span className="text-emerald-500/70 text-[10px] tracking-widest font-bold">Showing Records:</span>
          <span className="font-bold text-emerald-400 text-lg drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">
            {props.recordCount}
          </span>
        </div>
        
        {props.hasData && (
          <>
            <button 
              onClick={props.onExport}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 py-2.5 rounded-xl text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] tracking-widest"
            >
              Export Merged Dataset (.CSV)
            </button>
            <button 
              onClick={props.onReset}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-2 rounded-xl text-[10px] font-bold transition-all tracking-widest"
            >
              Clear All Data
            </button>
          </>
        )}
      </div>

      </div>
    </div>
  );
}
