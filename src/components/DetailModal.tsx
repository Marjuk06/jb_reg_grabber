import React from 'react';
import { StudentData } from './types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentData | null;
  currentIndex: number;
  totalRecords: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function DetailModal({ 
  isOpen, 
  onClose, 
  student, 
  currentIndex, 
  totalRecords, 
  onPrev, 
  onNext 
}: DetailModalProps) {
  
  if (!isOpen || !student) return null;

  const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='rgba(16,185,129,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
  const imgSrc = student.image || fallbackImg;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-500/50 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full w-8 h-8 flex items-center justify-center transition-all z-10 border border-emerald-500/30"
        >
          &times;
        </button>

        <div className="p-6">
          <div className="flex items-center gap-5 border-b border-white/10 pb-5 mb-5 pr-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgSrc} 
              alt={student.name}
              className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center font-bold text-3xl border border-white/20 object-cover bg-black/40 shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{student.name}</h2>
              <div className="inline-block px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest">
                Board Roll: {student.boardRoll || 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-300">
            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">Registration No:</div>
            <div className="font-mono text-emerald-400 font-bold">{student.regNo || 'N/A'}</div>
            
            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">Class Roll:</div>
            <div className="font-mono font-bold text-purple-400">{student.classRoll || '-'}</div>
            
            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">Seat Plan:</div>
            <div className="font-mono font-bold text-blue-400">{student.serialNum || '-'}</div>
            
            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">Group:</div>
            <div className="font-bold text-yellow-300">{student.group}</div>
            
            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">Gender:</div>
            <div className="font-bold" style={{ color: student.gender.toLowerCase().includes('fe') ? '#f472b6' : '#60a5fa' }}>
              {student.gender}
            </div>
            
            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">Student Type:</div>
            <div className="font-bold text-gray-200">{student.type}</div>
          </div>
        </div>

        <div className="bg-black/40 border-t border-emerald-500/20 p-4 flex justify-between items-center">
          <button 
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`px-6 py-2 text-[10px] rounded-xl border transition-all ${
              currentIndex === 0 
                ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50'
            }`}
          >
            &larr; Previous
          </button>
          
          <div className="text-[10px] text-emerald-500/50 tracking-widest font-mono">
            Record {currentIndex + 1} of {totalRecords}
          </div>
          
          <button 
            onClick={onNext}
            disabled={currentIndex === totalRecords - 1}
            className={`px-6 py-2 text-[10px] rounded-xl border transition-all ${
              currentIndex === totalRecords - 1
                ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50'
            }`}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
