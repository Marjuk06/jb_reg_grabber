"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Database } from 'lucide-react';
import DatabaseSyncSection from '@/components/DatabaseSyncSection';
import SidebarControls from '@/components/SidebarControls';
import StudentGrid from '@/components/StudentGrid';
import DetailModal from '@/components/DetailModal';
import CustomAlert, { AlertState } from '@/components/CustomAlert';
import { StudentData, SortMode, GenderFilter, GroupFilter, RoomFilter } from '@/components/types';
import { ROOM_MAPPINGS, getSeatInfo } from '@/lib/seatPlan';

import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const [baseData, setBaseData] = useState<StudentData[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState<SortMode>('boardRoll');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>(null);
  const [groupFilter, setGroupFilter] = useState<GroupFilter>(null);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(-1);
  const [alertState, setAlertState] = useState<AlertState>({ isOpen: false, type: 'info', title: '', message: '' });
  const [isLoadingDB, setIsLoadingDB] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const [isAppBooting, setIsAppBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    if (!isAppBooting) return;
    
    let isMounted = true;
    let currentProgress = 0;
    let logIndex = 0;
    
    const fakeConsoleLogs = [
      "[SYS] Initializing secure handshake protocols...",
      "[NET] Bypassing localized firewall restrictions...",
      "[AUTH] Validating RSA-2048 encryption keys...",
      "[DB] Connecting to Jessore Board Central Node...",
      "[DB] Connection established. Latency: 42ms",
      "[SYS] Requesting student demographics payload...",
      "[SYS] Awaiting server response...",
      "[DATA] Stream initiated. Downloading chunks...",
      "[DATA] Decrypting 256-bit encrypted payload...",
      "[SYS] Verifying data integrity...",
      "[SYS] Synchronization complete."
    ];

    setTimeout(console.log.bind(console, "%c[MASTER DASHBOARD BOOT SEQUENCE INITIATED]", "color: #10b981; font-weight: bold; font-size: 14px;"), 0);

    const step = () => {
      if (!isMounted) return;
      
      let delay = Math.random() * 250 + 100;
      if (Math.random() > 0.75) delay += 500; // 25% chance of a longer pause for realism
      
      setTimeout(() => {
        if (!isMounted) return;
        
        currentProgress += Math.floor(Math.random() * 12) + 2; 
        if (currentProgress >= 100) currentProgress = 100;
        
        setBootProgress(currentProgress);
        
        // Print logs matching progress
        const expectedLogIndex = Math.floor((currentProgress / 100) * fakeConsoleLogs.length);
        while (logIndex <= expectedLogIndex && logIndex < fakeConsoleLogs.length) {
           setTimeout(console.log.bind(console, `%c${fakeConsoleLogs[logIndex]}`, "color: #34d399; font-family: monospace;"), 0);
           logIndex++;
        }
        
        if (currentProgress < 100) {
          step();
        } else {
          setTimeout(console.log.bind(console, "%c[SYS] System ready. Awaiting user input.", "color: #60a5fa; font-weight: bold;"), 0);
          setTimeout(() => {
            if (isMounted) setIsAppBooting(false);
          }, 300);
        }
      }, delay);
    };
    
    step();
    return () => { isMounted = false; };
  }, [isAppBooting]);

  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

  const handleLoadFromDB = async () => {
    if (!groupFilter || !genderFilter) {
      setAlertState({
        isOpen: true,
        type: 'info',
        title: 'Configuration Required',
        message: 'Please select both a Group and Gender to initialize the sync.'
      });
      return;
    }

    setIsLoadingDB(true);
    setSyncProgress(0);
    setBaseData([]);
    
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 15;
      });
    }, 200);
    
    try {
      let allData: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let fetchMore = true;

      while (fetchMore) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('board_roll', { ascending: true })
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          if (data.length < pageSize) {
            fetchMore = false;
          } else {
            page++;
          }
        } else {
          fetchMore = false;
        }
      }
      
      clearInterval(progressInterval);
      setSyncProgress(100);

      setTimeout(() => {
        if (allData.length > 0) {
          const mappedData: StudentData[] = allData.map(d => ({
            regNo: d.reg_no || '',
            name: d.name || 'Unknown',
            boardRoll: d.board_roll || '',
            classRoll: d.class_roll || '',
            group: d.group || 'Unknown',
            gender: d.gender || 'Unknown',
            serialNum: d.serial_num || 0,
            type: d.student_type || 'Regular',
            image: d.image_url || ''
          }));
          
          const validData = mappedData.filter(d => 
            !d.type.toLowerCase().includes('irregular') && 
            !d.type.toLowerCase().includes('improvement') && 
            !d.type.toLowerCase().includes('private')
          );
          
          setBaseData(validData);
          setAlertState({
            isOpen: true,
            type: 'success',
            title: 'Sync Successful',
            message: `Successfully loaded ${validData.length} records from Jessore Board Central Database!`
          });
        } else {
          setBaseData([]);
          setAlertState({
            isOpen: true,
            type: 'info',
            title: 'Database Empty',
            message: 'No records were found in the Jessore Board database.'
          });
        }
        setIsLoadingDB(false);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      setSyncProgress(0);
      console.error(err);
      setAlertState({
        isOpen: true,
        type: 'error',
        title: 'Sync Failed',
        message: 'Error fetching from DB: ' + (err.message || JSON.stringify(err))
      });
      setIsLoadingDB(false);
    }
  };



  const handleRoomFilterChange = (newFilter: RoomFilter) => {
    setRoomFilter(newFilter);
  };

  const filteredData = useMemo(() => {
    let filtered = [...baseData];

    if (genderFilter) {
      filtered = filtered.filter(d => d.gender.toLowerCase() === genderFilter.toLowerCase());
    }

    if (groupFilter) {
      filtered = filtered.filter(d => {
        const grp = d.group.toLowerCase();
        return grp.includes(groupFilter.toLowerCase()) || 
               (groupFilter === 'Humanities' && grp.includes('arts')) || 
               (groupFilter === 'Business' && grp.includes('commerce'));
      });
    }

    if (roomFilter) {
      filtered = filtered.filter(d => {
        const seatInfo = getSeatInfo(d.boardRoll);
        if (!seatInfo) return false;
        const seatId = `${seatInfo.room}-${seatInfo.isMainCenter ? 'main' : 'sub'}`;
        return seatId === roomFilter;
      });
    }

    if (currentSort === 'serial') {
      filtered.sort((a, b) => a.serialNum - b.serialNum);
    } else if (currentSort === 'roll') {
      filtered.sort((a, b) => (parseInt(a.classRoll, 10) || 0) - (parseInt(b.classRoll, 10) || 0));
    } else if (currentSort === 'boardRoll') {
      const groupOrder: Record<string, number> = { 'science': 1, 'humanities': 2, 'arts': 2, 'business': 3, 'commerce': 3 };
      const getGroupVal = (g: string) => {
        const lower = g.toLowerCase();
        for (let key in groupOrder) if (lower.includes(key)) return groupOrder[key];
        return 4;
      };

      filtered.sort((a, b) => {
        const brA = parseInt(a.boardRoll, 10);
        const brB = parseInt(b.boardRoll, 10);
        if (!isNaN(brA) && !isNaN(brB) && brA !== brB) return brA - brB;

        const gA = getGroupVal(a.group), gB = getGroupVal(b.group);
        if (gA !== gB) return gA - gB;
        
        const genA = a.gender.toLowerCase().includes('fe') ? 1 : 2;
        const genB = b.gender.toLowerCase().includes('fe') ? 1 : 2;
        if (genA !== genB) return genA - genB;
        
        return (parseInt(a.regNo, 10) || 0) - (parseInt(b.regNo, 10) || 0);
      });
    }

    return filtered;
  }, [baseData, genderFilter, groupFilter, roomFilter, currentSort]);

  useEffect(() => {
    if (roomFilter && filteredData.length === 0) {
      const rm = ROOM_MAPPINGS.find(r => r.id === roomFilter);
      if (rm) {
        setAlertState({
          isOpen: true,
          type: 'info',
          title: `Room ${rm.label} - No Match`,
          message: `Room ${rm.label} (${rm.center}) is allocated for ${rm.group} (Roll: ${rm.rollRange}). Your current filters or database don't contain these students. Please choose another room or upload the specific roll range to see the required students.`
        });
      }
    }
  }, [roomFilter, filteredData.length]);

  const displayData = filteredData;

  const handleExport = () => {
    if (!displayData.length) return;
    
    const headers = ["BoardRoll", "SeatPlanSerial", "StudentName", "ClassRoll", "RegNo", "Gender", "Group", "StudentType", "ImageURL"];
    const csvRows = [headers.join(',')];
    
    displayData.forEach(r => {
      csvRows.push(`"${r.boardRoll}","${r.serialNum}","${r.name}","${r.classRoll}","${r.regNo}","${r.gender}","${r.group}","${r.type}","${r.image}"`);
    });
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csvRows.join('\\n')], { type: 'text/csv' }));
    a.download = 'CYBER_CORE_MASTER_DB.csv';
    a.click();
  };

  const handleReset = () => {
    setAlertState({
      isOpen: true,
      type: 'confirm',
      title: 'Clear All Data?',
      message: 'Are you sure you want to clear all merged data? This cannot be undone.',
      onConfirm: () => {
        setBaseData([]);
        setSearchQuery('');
        setGenderFilter(null);
        setGroupFilter(null);
        setCurrentSort('boardRoll');
        setModalOpen(false);
      }
    });
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full lg:max-h-[95vh] gap-5 mt-4 md:mt-6 mb-4 md:mb-6 px-4 md:px-6 animate-fade-in">
      <DatabaseSyncSection 
        onSync={handleLoadFromDB} 
        isLoading={isLoadingDB || isAppBooting} 
        progress={isAppBooting ? bootProgress : syncProgress} 
        hasData={baseData.length > 0} 
      />
      
      {!isLoadingDB && baseData.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-5 flex-grow lg:overflow-hidden animate-slide-up">
        <SidebarControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentSort={currentSort}
          setCurrentSort={setCurrentSort}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          roomFilter={roomFilter}
          setRoomFilter={handleRoomFilterChange}
          recordCount={displayData.length}
          onExport={handleExport}
          onReset={handleReset}
          hasData={baseData.length > 0}
        />
        
        <div className="flex flex-col gap-3 flex-grow lg:overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 px-1 shrink-0 min-h-[36px]">
            <span className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold shrink-0">Room:</span>
            {ROOM_MAPPINGS.map(rm => {
              const active = roomFilter === rm.id;
              return (
                <button 
                  key={rm.id} 
                  onClick={() => handleRoomFilterChange(active ? null : rm.id)} 
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-full border transition-all shrink-0 ${
                    active 
                      ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-emerald-400'
                  }`}
                  title={`${rm.group} | ${rm.rollRange}`}
                >
                  {rm.label}
                </button>
              );
            })}
          </div>
          <StudentGrid 
            data={displayData} 
            searchQuery={searchQuery}
            isHighlightMode={true}
            onStudentClick={(idx) => {
              setCurrentStudentIndex(idx);
              setModalOpen(true);
            }}
            hasData={baseData.length > 0}
          />
        </div>
      </div>
      )}
      
      {!isLoadingDB && baseData.length === 0 && (
        <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-emerald-800/30 rounded-2xl bg-black/20 m-4 lg:m-0 py-12 px-4 animate-scale-in gap-8">
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Initial Setup</h2>
            <p className="text-emerald-500/70 text-sm max-w-md">Select your target demographics before initializing the central database synchronization.</p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-md bg-black/40 p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-emerald-500/60 font-bold">1. Select Group</span>
              <div className="grid grid-cols-3 gap-2">
                {['Science', 'Humanities', 'Business'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setGroupFilter(g as GroupFilter)} 
                    className={`py-3 text-[11px] font-bold rounded-xl border transition-all ${
                      groupFilter === g 
                        ? 'bg-emerald-500/25 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-emerald-500/60 font-bold">2. Select Gender</span>
              <div className="grid grid-cols-2 gap-2">
                {['Male', 'Female'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setGenderFilter(g as GenderFilter)} 
                    className={`py-3 text-[11px] font-bold rounded-xl border transition-all ${
                      genderFilter === g 
                        ? 'bg-emerald-500/25 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleLoadFromDB}
              disabled={isAppBooting}
              className={`mt-4 w-full py-4 rounded-xl text-sm font-bold tracking-widest transition-all ${
                isAppBooting 
                  ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-500/30 cursor-wait'
                  : 'bg-emerald-600/20 hover:bg-emerald-500/40 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isAppBooting ? `ESTABLISHING LINK... ${bootProgress}%` : 'LOAD DATA'}
            </button>
          </div>
          
        </div>
      )}

      <DetailModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={displayData[currentStudentIndex] || null}
        currentIndex={currentStudentIndex}
        totalRecords={displayData.length}
        onPrev={() => setCurrentStudentIndex(prev => Math.max(0, prev - 1))}
        onNext={() => setCurrentStudentIndex(prev => Math.min(displayData.length - 1, prev + 1))}
      />

      <CustomAlert 
        {...alertState}
        onClose={closeAlert}
      />
    </div>
  );
}
