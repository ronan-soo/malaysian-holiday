
import { addDays, format, isSaturday, isSunday, parseISO, eachDayOfInterval, differenceInCalendarDays } from 'date-fns';
import { PublicHoliday, LongHolidayProposal, DayType } from '../types';

export const getLongHolidays = (
  year: number,
  holidays: PublicHoliday[],
  maxLeave: number = 2,
  minTotal: number = 4
): LongHolidayProposal[] => {
  const proposals: LongHolidayProposal[] = [];
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  
  const daysInYear = eachDayOfInterval({ start: startOfYear, end: endOfYear });
  
  // Create a quick lookup for holiday types
  const holidayMap = new Map<string, PublicHoliday[]>();
  holidays.forEach(h => {
    const existing = holidayMap.get(h.date) || [];
    holidayMap.set(h.date, [...existing, h]);
  });

  const getDayType = (date: Date): DayType => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (holidayMap.has(dateStr)) return DayType.HOLIDAY;
    if (isSaturday(date) || isSunday(date)) return DayType.WEEKEND;
    return DayType.WORK;
  };

  // Sliding window across the year to find contiguous blocks that satisfy maxLeave
  // Optimization: only start scanning from holidays or weekends
  for (let i = 0; i < daysInYear.length; i++) {
    const startDate = daysInYear[i];
    if (getDayType(startDate) === DayType.WORK) continue;

    let leaveUsed = 0;
    let hasHoliday = false;
    let currentBlock: Date[] = [];

    // Try to extend the block as far as possible
    for (let j = i; j < daysInYear.length; j++) {
      const currentDate = daysInYear[j];
      const type = getDayType(currentDate);

      if (type === DayType.HOLIDAY) {
        hasHoliday = true;
        currentBlock.push(currentDate);
      } else if (type === DayType.WEEKEND) {
        currentBlock.push(currentDate);
      } else if (type === DayType.WORK) {
        if (leaveUsed < maxLeave) {
          leaveUsed++;
          currentBlock.push(currentDate);
        } else {
          // Cannot bridge further
          break;
        }
      }

      // If we finished a potential block, validate and record
      const totalDays = currentBlock.length;
      if (totalDays >= minTotal && hasHoliday) {
        // Backtrack to ensure we don't end on a leave day (inefficient)
        let trimmedBlock = [...currentBlock];
        let trimmedLeave = leaveUsed;
        while (trimmedBlock.length > 0 && getDayType(trimmedBlock[trimmedBlock.length - 1]) === DayType.WORK) {
          trimmedBlock.pop();
          trimmedLeave--;
        }

        if (trimmedBlock.length >= minTotal && trimmedLeave <= maxLeave) {
          const start = format(trimmedBlock[0], 'yyyy-MM-dd');
          const end = format(trimmedBlock[trimmedBlock.length - 1], 'yyyy-MM-dd');
          
          const proposal: LongHolidayProposal = {
            id: `proposal-${start}-${end}`,
            startDate: start,
            endDate: end,
            totalDays: trimmedBlock.length,
            leaveDaysRequired: trimmedLeave,
            description: `Take ${trimmedLeave} day${trimmedLeave === 1 ? '' : 's'} leave to get ${trimmedBlock.length} consecutive days off`,
            score: trimmedBlock.length / (trimmedLeave || 0.5), // Efficiency score
            breakdown: {
              publicHolidays: trimmedBlock.filter(d => getDayType(d) === DayType.HOLIDAY).flatMap(d => holidayMap.get(format(d, 'yyyy-MM-dd')) || []),
              weekends: trimmedBlock.filter(d => getDayType(d) === DayType.WEEKEND).map(d => format(d, 'yyyy-MM-dd')),
              leaveDays: trimmedBlock.filter(d => getDayType(d) === DayType.WORK).map(d => format(d, 'yyyy-MM-dd')),
            }
          };
          proposals.push(proposal);
        }
      }
    }
  }

  // Deduplicate and filter overlapping
  // Keep the most efficient proposal for any given range
  const uniqueProposals = proposals.sort((a, b) => b.score - a.score).reduce((acc, current) => {
    const isOverlapping = acc.some(p => 
      (current.startDate >= p.startDate && current.startDate <= p.endDate) ||
      (current.endDate >= p.startDate && current.endDate <= p.endDate)
    );
    if (!isOverlapping) acc.push(current);
    return acc;
  }, [] as LongHolidayProposal[]);

  return uniqueProposals.sort((a, b) => a.startDate.localeCompare(b.startDate));
};
