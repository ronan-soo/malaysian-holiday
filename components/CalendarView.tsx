
import React from 'react';
import { 
  format, 
  endOfMonth, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay
} from 'date-fns';
import { PublicHoliday, LongHolidayProposal } from '../types';

interface CalendarViewProps {
  holidays: PublicHoliday[];
  proposals: LongHolidayProposal[];
  selectedState: string;
}

/**
 * Custom implementations for missing date-fns members to bypass module resolution issues.
 */
const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
};

const CalendarView: React.FC<CalendarViewProps> = ({ holidays, proposals }) => {
  const months = Array.from({ length: 12 }, (_, i) => new Date(2026, i, 1));
  const holidayDates = new Set(holidays.map(h => h.date));
  
  const isLeaveDate = (date: Date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    return proposals.some(p => p.breakdown.leaveDays.includes(dStr));
  };

  const isProposalRange = (date: Date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    return proposals.some(p => dStr >= p.startDate && dStr <= p.endDate);
  };

  const renderMonth = (month: Date) => {
    // Replaced startOfWeek and startOfMonth with local native implementations
    const start = getStartOfWeek(getStartOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    const days = eachDayOfInterval({ start, end });

    return (
      <div key={month.toString()} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-3 border-b pb-2">{format(month, 'MMMM')}</h4>
        <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-slate-400 mb-2 uppercase text-center">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isHoliday = holidayDates.has(dateStr);
            const isProposal = isProposalRange(day);
            const isLeave = isLeaveDate(day);
            const isCurrentMonth = isSameMonth(day, month);
            
            // Native weekend check
            const dayIdx = day.getDay();
            const isWeekend = dayIdx === 0 || dayIdx === 6;

            let bgColor = 'bg-white';
            let textColor = 'text-slate-700';
            
            if (!isCurrentMonth) {
              textColor = 'text-slate-200';
            } else if (isHoliday) {
              bgColor = 'bg-rose-500';
              textColor = 'text-white font-bold';
            } else if (isLeave) {
              bgColor = 'bg-amber-400';
              textColor = 'text-white font-bold';
            } else if (isProposal) {
              bgColor = 'bg-emerald-100';
              textColor = 'text-emerald-800 font-semibold';
            } else if (isWeekend) {
              bgColor = 'bg-slate-50';
              textColor = 'text-slate-400';
            }

            return (
              <div 
                key={day.toString()} 
                className={`h-7 w-7 flex items-center justify-center rounded-md text-[11px] transition-all cursor-default ${bgColor} ${textColor} group relative`}
                title={isHoliday ? holidays.find(h => h.date === dateStr)?.name : ''}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 text-xs font-medium text-slate-500 px-2">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded"></div> Holiday</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-400 rounded"></div> Take Leave</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-100 rounded"></div> Long Weekend</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-50 rounded"></div> Weekend</div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map(renderMonth)}
      </div>
    </div>
  );
};

export default CalendarView;
