import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
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
  const itemsPerLoad = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 24;
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerLoad);
  
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 500) {
      setShowScrollTop(true);
    } else if (window.scrollY <= 500) {
      setShowScrollTop(false);
    }
  };

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else if (!scrollContainerRef.current || scrollContainerRef.current.scrollTop <= 500) {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  const scrollToTop = () => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop > 0) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          setVisibleCount(firstMatchIndex + itemsPerLoad);
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
        setVisibleCount(prev => prev + itemsPerLoad);
      }
    });
    if (node) observer.current.observe(node);
  }, [visibleCount, data.length, itemsPerLoad]);

  const gridColsClass = cols === 1 ? 'md:grid-cols-1' : 
                        cols === 2 ? 'md:grid-cols-2' : 
                        cols === 3 ? 'md:grid-cols-3' : 
                        cols === 4 ? 'md:grid-cols-4' : 
                        cols === 5 ? 'md:grid-cols-5' : 'md:grid-cols-6';

  return (
    <div className="bg-[#050b14] md:bg-black/60 md:backdrop-blur-2xl border border-blue-600/25 rounded-2xl md:shadow-2xl p-3 md:p-4 flex-grow flex flex-col overflow-hidden relative gap-4">
      
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

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex-grow overflow-y-auto pr-2 rounded-xl grid gap-4 content-start grid-cols-1 ${gridColsClass}`}
      >
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
                  style={{ animationDelay: `${Math.min((index % itemsPerLoad) * 0.05, 1)}s` }}
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

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          title="Scroll to Top"
          className="fixed bottom-6 right-6 z-[60] bg-emerald-500/90 hover:bg-emerald-400 text-black p-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all animate-fade-in hover:scale-110 border border-emerald-300"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
