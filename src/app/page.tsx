"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Database } from 'lucide-react';
import DatabaseSyncSection from '@/components/DatabaseSyncSection';
import SidebarControls from '@/components/SidebarControls';
import StudentGrid from '@/components/StudentGrid';
import DetailModal from '@/components/DetailModal';
import CustomAlert, { AlertState } from '@/components/CustomAlert';
import { StudentData, SortMode, GenderFilter, GroupFilter } from '@/components/types';

import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const [baseData, setBaseData] = useState<StudentData[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState<SortMode>('boardRoll');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>(null);
  const [groupFilter, setGroupFilter] = useState<GroupFilter>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(-1);
  const [alertState, setAlertState] = useState<AlertState>({ isOpen: false, type: 'info', title: '', message: '' });
  const [isLoadingDB, setIsLoadingDB] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

  const handleLoadFromDB = async () => {
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
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('board_roll', { ascending: true });

      if (error) throw error;
      
      clearInterval(progressInterval);
      setSyncProgress(100);

      setTimeout(() => {
        if (data && data.length > 0) {
          const mappedData: StudentData[] = data.map(d => ({
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
  }, [baseData, genderFilter, groupFilter, currentSort]);

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
      <DatabaseSyncSection onSync={handleLoadFromDB} isLoading={isLoadingDB} progress={syncProgress} />
      
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
          recordCount={displayData.length}
          onExport={handleExport}
          onReset={handleReset}
          hasData={baseData.length > 0}
        />
        
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
      )}
      
      {!isLoadingDB && baseData.length === 0 && (
        <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-cyan-800 rounded-2xl bg-black/40 m-4 lg:m-0 py-16 px-4 animate-scale-in">
          <Database className="text-cyan-900 w-16 h-16 mb-4" />
          <p className="text-cyan-700 font-bold tracking-widest uppercase text-center">No Data Loaded</p>
          <p className="text-cyan-800 text-sm mt-2 text-center max-w-sm">
            Click "Sync from Database" to fetch records from the central server.
          </p>
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
