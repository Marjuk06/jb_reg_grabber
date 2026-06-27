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
  const [highlightedRegNos, setHighlightedRegNos] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(24);

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

  // Handle Search Highlighting & ensure match is visible
  useEffect(() => {
    if (isHighlightMode && searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches = data.filter(d => 
        (d.regNo && d.regNo.toLowerCase().includes(q)) ||
        (d.name && d.name.toLowerCase().includes(q)) ||
        (String(d.serialNum).includes(q)) ||
        (d.boardRoll && String(d.boardRoll).includes(q)) ||
        (d.classRoll && String(d.classRoll).includes(q))
      );
      
      if (matches.length > 0) {
        const matchRegNos = matches.map(m => m.regNo);
        setHighlightedRegNos(matchRegNos);
        
        // Find first match index to ensure it's rendered
        const firstMatchIndex = data.findIndex(d => d.regNo === matchRegNos[0]);
        if (firstMatchIndex !== -1 && firstMatchIndex >= visibleCount) {
          setVisibleCount(firstMatchIndex + 24);
        }
      } else {
        setHighlightedRegNos([]);
      }
    } else {
      setHighlightedRegNos([]);
    }
  }, [searchQuery, isHighlightMode, data]);

  // Scroll to the first highlighted element
  useEffect(() => {
    if (highlightedRegNos.length > 0) {
      // Small delay to allow DOM to render if we just expanded visibleCount
      setTimeout(() => {
        const el = document.getElementById(`student-${highlightedRegNos[0]}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightedRegNos]);

  // Infinite Scroll Observer
  const observer = React.useRef<IntersectionObserver | null>(null);
  const lastElementRef = React.useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < data.length) {
        setVisibleCount(prev => prev + 24);
      }
    });
    if (node) observer.current.observe(node);
  }, [visibleCount, data.length]);

  const gridColsClass = cols === 1 ? 'md:grid-cols-1' : 
                        cols === 2 ? 'md:grid-cols-2' : 
                        cols === 3 ? 'md:grid-cols-3' : 
                        cols === 4 ? 'md:grid-cols-4' : 
                        cols === 5 ? 'md:grid-cols-5' : 'md:grid-cols-6';

  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-blue-600/25 rounded-2xl shadow-2xl p-4 flex-grow flex flex-col overflow-hidden relative gap-4">
      
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
          <>
            {data.slice(0, visibleCount).map((student, index) => {
              const isLast = index === visibleCount - 1;
              return (
                <div 
                  key={student.regNo || index} 
                  id={`student-${student.regNo}`}
                  ref={isLast ? lastElementRef : null}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${Math.min((index % 24) * 0.05, 1)}s` }}
                >
                  <StudentCard 
                    student={student} 
                    isHighlighted={highlightedRegNos.includes(student.regNo)}
                    onClick={() => onStudentClick(index)}
                    cardRef={() => {}}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
