import React, { useEffect, useState } from 'react';
import { StudentData } from './types';
import StudentCard from './StudentCard';

interface StudentGridProps {
  data: StudentData[];
  searchQuery: string;
  isHighlightMode: boolean;
  onStudentClick: (index: number) => void;
  hasData: boolean;
}

export default function StudentGrid({ data, searchQuery, isHighlightMode, onStudentClick, hasData }: StudentGridProps) {
  const [cols, setCols] = useState<number>(3);
  const [highlightedRegNo, setHighlightedRegNo] = useState<string | null>(null);

  // Resize listener for mobile fallback
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCols(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Search Highlighting
  useEffect(() => {
    if (isHighlightMode && searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = data.find(d => 
        (d.regNo && d.regNo.toLowerCase().includes(q)) ||
        (d.name && d.name.toLowerCase().includes(q)) ||
        (String(d.serialNum).includes(q)) ||
        (d.boardRoll && String(d.boardRoll).includes(q)) ||
        (d.classRoll && String(d.classRoll).includes(q))
      );
      if (match) {
        setHighlightedRegNo(match.regNo);
      } else {
        setHighlightedRegNo(null);
      }
    } else {
      setHighlightedRegNo(null);
    }
  }, [searchQuery, isHighlightMode, data]);

  // Scroll to highlighted element
  useEffect(() => {
    if (highlightedRegNo) {
      const el = document.getElementById(`student-${highlightedRegNo}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedRegNo]);

  const gridColsClass = cols === 1 ? 'md:grid-cols-1' : 
                        cols === 2 ? 'md:grid-cols-2' : 
                        cols === 3 ? 'md:grid-cols-3' : 
                        cols === 4 ? 'md:grid-cols-4' : 
                        cols === 5 ? 'md:grid-cols-5' : 'md:grid-cols-6';

  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-blue-600/25 rounded-2xl shadow-2xl p-4 flex-grow flex flex-col overflow-hidden relative gap-4">
      
      {/* Layout Controls */}
      <div className="hidden md:flex justify-between items-center bg-black/40 border border-emerald-500/20 rounded-xl p-2 px-4 shrink-0 shadow-inner">
        <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">Layout View</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6].map(c => (
            <button 
              key={c}
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 768) setCols(c);
              }}
              className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs transition-all ${
                cols === c 
                  ? 'bg-emerald-500/30 text-white border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                  : 'bg-emerald-500/5 text-emerald-500 border border-transparent hover:bg-emerald-500/15'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-grow overflow-y-auto pr-2 rounded-xl grid gap-4 content-start grid-cols-1 ${gridColsClass}`}>
        {!hasData ? (
          <div className="col-span-full h-full flex flex-col items-center justify-center text-emerald-500/30 text-sm border-2 border-dashed border-emerald-500/20 rounded-2xl min-h-[300px] bg-black/20">
            <div className="text-4xl mb-4 opacity-50">⚙️</div>
            <p>No Data Loaded</p>
            <p>Please upload and merge your files to proceed.</p>
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full h-full flex flex-col items-center justify-center text-emerald-500/30 text-sm border-2 border-dashed border-emerald-500/20 rounded-2xl min-h-[300px] bg-black/20">
            <div className="text-4xl mb-4 opacity-50">🔍</div>
            <p>No matching records found.</p>
          </div>
        ) : (
          data.map((student, index) => (
            <div key={student.regNo || index} id={`student-${student.regNo}`}>
              <StudentCard 
                student={student} 
                isHighlighted={student.regNo === highlightedRegNo}
                onClick={() => onStudentClick(index)}
                cardRef={() => {}}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
