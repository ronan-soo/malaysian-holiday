
import React from 'react';
import { format } from 'date-fns';
import { PublicHoliday } from '../types';

interface HolidayListProps {
  holidays: PublicHoliday[];
}

/**
 * Safely parses yyyy-MM-dd without timezone shifts.
 * Using native Date(y, m, d) is safer than new Date(str) in many browser versions.
 */
const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const HolidayList: React.FC<HolidayListProps> = ({ holidays }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-xl">📅</span> Public Holidays 2026
        </h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {holidays.length === 0 ? (
          <div className="p-8 text-center text-slate-400 italic">No holidays found for selected filters.</div>
        ) : (
          holidays.map((holiday) => (
            <div key={`${holiday.id}-${holiday.state}`} className="p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{holiday.name}</h4>
                  <p className="text-sm text-slate-500">
                    {format(parseDate(holiday.date), 'EEEE, d MMM')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                   {holiday.state ? (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                      {holiday.state}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 uppercase">
                      National
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HolidayList;
