import React from 'react';
import { StudentData } from './types';

interface StudentCardProps {
  student: StudentData;
  isHighlighted: boolean;
  onClick: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

export default function StudentCard({ student, isHighlighted, onClick, cardRef }: StudentCardProps) {
  const getGroupStyle = (group: string) => {
    const g = group.toLowerCase();
    if (g.includes('sci')) return { c: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' };
    if (g.includes('hum') || g.includes('art')) return { c: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' };
    if (g.includes('bus') || g.includes('com')) return { c: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' };
    return { c: '#9ca3af', bg: 'rgba(156, 163, 175, 0.15)' };
  };

  const isFemale = student.gender.toLowerCase().includes('fe');
  const genColor = isFemale ? '#f472b6' : '#60a5fa';
  
  const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='rgba(16,185,129,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
  const imgSrc = student.image || fallbackImg;
  const grpStyle = getGroupStyle(student.group);

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all border ${
        isHighlighted 
          ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
          : 'bg-black/40 border-emerald-500/10 hover:bg-emerald-500/5 hover:border-emerald-500/30'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imgSrc} 
            alt={student.name}
            className="w-10 h-10 rounded-full border border-white/20 object-cover bg-black/40 shadow-lg shrink-0" 
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
          />
          <div className="flex flex-col overflow-hidden w-full">
            <span className="font-bold text-white text-[13px] truncate tracking-wide" title={student.name}>
              {student.name}
            </span>
            <div className="flex gap-2 items-center mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${student.boardRoll ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-white/5 border-white/10 text-white/40'}`}>
                BR: {student.boardRoll || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-auto pt-3 border-t border-emerald-500/20 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center text-[11px]">
            <span className="text-emerald-400" title="Reg No">{student.regNo || 'N/A'}</span>
            <span className="text-emerald-500/30">|</span>
            <span className="text-blue-400" title="Seat Plan Serial">S:#{student.serialNum || '-'}</span>
            <span className="text-emerald-500/30">|</span>
            <span className="text-purple-400" title="Class Roll">R:#{student.classRoll || '-'}</span>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border" style={{ color: genColor, backgroundColor: `${genColor}15`, borderColor: `${genColor}30` }}>
            {isFemale ? 'F' : 'M'}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border" style={{ color: grpStyle.c, backgroundColor: grpStyle.bg, borderColor: `${grpStyle.c}30` }}>
            {student.group.substring(0, 3).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
