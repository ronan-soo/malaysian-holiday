
import React, { useState, useMemo, useEffect } from 'react';
import { HOLIDAYS_2026, MALAYSIAN_STATES } from './constants';
import { MalaysianState, PublicHoliday, LongHolidayProposal } from './types';
import { getLongHolidays } from './utils/optimizer';
import HolidayList from './components/HolidayList';
import CalendarView from './components/CalendarView';
import ProposalCard from './components/ProposalCard';

const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<MalaysianState>('All');
  const [maxLeave, setMaxLeave] = useState<number>(2);
  const [minTotalDays, setMinTotalDays] = useState<number>(4);
  const [viewMode, setViewMode] = useState<'calendar' | 'proposals'>('proposals');

  const filteredHolidays = useMemo(() => {
    return HOLIDAYS_2026.filter(h => 
      selectedState === 'All' || h.state === null || h.state === selectedState
    ).sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedState]);

  const proposals = useMemo(() => {
    return getLongHolidays(2026, filteredHolidays, maxLeave, minTotalDays);
  }, [filteredHolidays, maxLeave, minTotalDays]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌴</span>
            <h1 className="text-xl font-bold tracking-tight">Malaysian Holiday <span className="text-emerald-300 font-light">Planner 2026</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs font-medium bg-emerald-900/50 p-1 rounded-lg">
             <button 
              onClick={() => setViewMode('proposals')}
              className={`px-4 py-1.5 rounded-md transition-all ${viewMode === 'proposals' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:bg-emerald-700/50'}`}
             >
              Proposals
             </button>
             <button 
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:bg-emerald-700/50'}`}
             >
              Calendar
             </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Mobile View Toggles */}
        <div className="md:hidden flex mb-6 bg-slate-200 p-1 rounded-xl">
           <button 
              onClick={() => setViewMode('proposals')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm ${viewMode === 'proposals' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'}`}
             >
              🎯 Proposals
             </button>
             <button 
              onClick={() => setViewMode('calendar')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm ${viewMode === 'calendar' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500'}`}
             >
              📅 Calendar
             </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                Plan Filters
              </h2>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your State</label>
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as MalaysianState)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 font-medium"
                >
                  {MALAYSIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <p className="text-[10px] text-slate-400 italic">Includes state-specific and federal holidays</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Leave Days</label>
                   <span className="text-emerald-600 font-bold bg-emerald-50 px-2 rounded">{maxLeave}</span>
                </div>
                <input 
                  type="range" min="0" max="4" step="1" 
                  value={maxLeave}
                  onChange={(e) => setMaxLeave(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>0 DAYS</span><span>4 DAYS</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Min Trip Length</label>
                   <span className="text-emerald-600 font-bold bg-emerald-50 px-2 rounded">{minTotalDays}</span>
                </div>
                <input 
                  type="range" min="3" max="10" step="1" 
                  value={minTotalDays}
                  onChange={(e) => setMinTotalDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>3 DAYS</span><span>10 DAYS</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block h-[500px]">
              <HolidayList holidays={filteredHolidays} />
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {viewMode === 'calendar' ? (
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">2026 Year View</h2>
                      <p className="text-slate-500">Overview of all holidays and optimized blocks</p>
                    </div>
                 </div>
                 <CalendarView holidays={filteredHolidays} proposals={proposals} selectedState={selectedState} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Long Holiday Opportunities</h2>
                      <p className="text-slate-500">Found {proposals.length} strategic vacation windows</p>
                    </div>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {proposals.map(p => (
                    <ProposalCard key={p.id} proposal={p} />
                  ))}
                  {proposals.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                       <span className="text-4xl mb-4">🏜️</span>
                       <p className="font-bold">No proposals found</p>
                       <p className="text-sm">Try increasing "Max Leave Days" or decreasing "Min Trip Length"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 lg:hidden">
              <HolidayList holidays={filteredHolidays} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action / Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 md:hidden z-50">
        <div className="flex justify-around items-center max-w-7xl mx-auto px-4">
           <div className="flex flex-col items-center gap-1">
              <span className="text-emerald-700 font-bold text-lg">{proposals.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Proposals</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-rose-500 font-bold text-lg">{filteredHolidays.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Holidays</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <span className="text-amber-500 font-bold text-lg">{maxLeave}d</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Max Leave</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
