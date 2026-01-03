import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Configurable holiday list - customize this array with your organization's holidays
 * Format: 'YYYY-MM-DD'
 */
export const DEFAULT_HOLIDAYS = [
  '2026-01-26', // Republic Day
  '2026-03-14', // Holi
  '2026-08-15', // Independence Day
  '2026-10-02', // Gandhi Jayanti
  '2026-10-24', // Diwali
  '2026-12-25', // Christmas
];

/**
 * Calculate total days between two dates (inclusive)
 * @param {dayjs.Dayjs} startDate - Start date
 * @param {dayjs.Dayjs} endDate - End date
 * @returns {number} Total days including both start and end dates
 */
export const calculateTotalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).startOf('day');
  
  // Inclusive calculation: add 1 to include both start and end dates
  return end.diff(start, 'day') + 1;
};

/**
 * Normalize and merge overlapping blocked date ranges
 * This prevents double-counting days that appear in multiple ranges
 * @param {Array} blockedRanges - Array of {start, end} objects
 * @returns {Array} Merged array of non-overlapping ranges
 */
export const normalizeBlockedRanges = (blockedRanges) => {
  if (!blockedRanges || blockedRanges.length === 0) return [];
  
  // Filter out invalid ranges and convert to dayjs
  const validRanges = blockedRanges
    .filter(range => range.start && range.end)
    .map(range => ({
      start: dayjs(range.start).startOf('day'),
      end: dayjs(range.end).startOf('day'),
    }))
    .filter(range => range.end.isSameOrAfter(range.start));
  
  if (validRanges.length === 0) return [];
  
  // Sort by start date
  validRanges.sort((a, b) => a.start.diff(b.start));
  
  // Merge overlapping ranges
  const merged = [validRanges[0]];
  
  for (let i = 1; i < validRanges.length; i++) {
    const current = validRanges[i];
    const lastMerged = merged[merged.length - 1];
    
    // Check if current range overlaps or is adjacent to the last merged range
    if (current.start.isSameOrBefore(lastMerged.end.add(1, 'day'))) {
      // Merge by extending the end date if necessary
      if (current.end.isAfter(lastMerged.end)) {
        lastMerged.end = current.end;
      }
    } else {
      // No overlap, add as new range
      merged.push(current);
    }
  }
  
  return merged;
};

/**
 * Calculate total blocked days within the issue date range
 * Only counts blocked days that fall within [startDate, endDate]
 * Handles overlapping ranges correctly
 * @param {dayjs.Dayjs} startDate - Issue start date
 * @param {dayjs.Dayjs} endDate - Issue end date
 * @param {Array} blockedRanges - Array of {start, end} objects
 * @returns {number} Total blocked days
 */
export const calculateBlockedDays = (startDate, endDate, blockedRanges) => {
  if (!startDate || !endDate) return 0;
  
  const issueStart = dayjs(startDate).startOf('day');
  const issueEnd = dayjs(endDate).startOf('day');
  
  // Normalize to prevent double-counting overlaps
  const normalizedRanges = normalizeBlockedRanges(blockedRanges);
  
  let totalBlockedDays = 0;
  
  for (const range of normalizedRanges) {
    // Find the intersection of blocked range with issue range
    const intersectionStart = range.start.isAfter(issueStart) ? range.start : issueStart;
    const intersectionEnd = range.end.isBefore(issueEnd) ? range.end : issueEnd;
    
    // Only count if there's an actual intersection
    if (intersectionEnd.isSameOrAfter(intersectionStart)) {
      totalBlockedDays += intersectionEnd.diff(intersectionStart, 'day') + 1;
    }
  }
  
  return totalBlockedDays;
};

/**
 * Check if a specific date falls within any blocked range
 * @param {dayjs.Dayjs} date - Date to check
 * @param {Array} normalizedRanges - Normalized blocked ranges
 * @returns {boolean} True if date is blocked
 */
const isDateBlocked = (date, normalizedRanges) => {
  return normalizedRanges.some(range => 
    date.isSameOrAfter(range.start) && date.isSameOrBefore(range.end)
  );
};

/**
 * Calculate weekend days (Saturday & Sunday) within the issue range
 * Excludes weekends that fall on blocked dates (blocked dates override weekends)
 * @param {dayjs.Dayjs} startDate - Issue start date
 * @param {dayjs.Dayjs} endDate - Issue end date
 * @param {Array} blockedRanges - Array of {start, end} objects
 * @returns {number} Count of weekend days (excluding blocked weekends)
 */
export const calculateWeekendDays = (startDate, endDate, blockedRanges) => {
  if (!startDate || !endDate) return 0;
  
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).startOf('day');
  const normalizedRanges = normalizeBlockedRanges(blockedRanges);
  
  let weekendCount = 0;
  let currentDate = start;
  
  // Iterate through each day in the range
  while (currentDate.isSameOrBefore(end)) {
    const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday
    
    // Check if it's a weekend (Saturday or Sunday)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Only count if NOT blocked (blocked dates override weekends)
      if (!isDateBlocked(currentDate, normalizedRanges)) {
        weekendCount++;
      }
    }
    
    currentDate = currentDate.add(1, 'day');
  }
  
  return weekendCount;
};

/**
 * Calculate holiday days within the issue range
 * Excludes holidays that fall on blocked dates (blocked dates override holidays)
 * @param {dayjs.Dayjs} startDate - Issue start date
 * @param {dayjs.Dayjs} endDate - Issue end date
 * @param {Array} blockedRanges - Array of {start, end} objects
 * @param {Array} holidays - Array of holiday date strings ('YYYY-MM-DD')
 * @returns {number} Count of holiday days (excluding blocked holidays)
 */
export const calculateHolidayDays = (startDate, endDate, blockedRanges, holidays = DEFAULT_HOLIDAYS) => {
  if (!startDate || !endDate || !holidays || holidays.length === 0) return 0;
  
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).startOf('day');
  const normalizedRanges = normalizeBlockedRanges(blockedRanges);
  
  let holidayCount = 0;
  
  for (const holiday of holidays) {
    const holidayDate = dayjs(holiday).startOf('day');
    
    // Check if holiday falls within issue range
    if (holidayDate.isSameOrAfter(start) && holidayDate.isSameOrBefore(end)) {
      // Only count if NOT blocked (blocked dates override holidays)
      if (!isDateBlocked(holidayDate, normalizedRanges)) {
        holidayCount++;
      }
    }
  }
  
  return holidayCount;
};

/**
 * Calculate Age of Issue
 * Formula: Total Days - Blocked Days - Holiday Days
 * @param {dayjs.Dayjs} startDate - Issue start date
 * @param {dayjs.Dayjs} endDate - Issue end date
 * @param {number} blockedDays - Total blocked days
 * @param {number} holidayDays - Total holiday days
 * @returns {number} Age of issue in days
 */
export const calculateAgeOfIssue = (startDate, endDate, blockedDays, holidayDays) => {
  const totalDays = calculateTotalDays(startDate, endDate);
  return Math.max(0, totalDays - blockedDays - holidayDays);
};

/**
 * Calculate Time to Resolve
 * Formula: Total Days - Blocked Days - Holiday Days - Weekend Days
 * @param {number} totalDays - Total days between start and end
 * @param {number} blockedDays - Total blocked days
 * @param {number} holidayDays - Total holiday days (excluding blocked)
 * @param {number} weekendDays - Total weekend days (excluding blocked)
 * @returns {number} Time to resolve in days
 */
export const calculateTimeToResolve = (totalDays, blockedDays, holidayDays, weekendDays) => {
  return Math.max(0, totalDays - blockedDays - holidayDays - weekendDays);
};

/**
 * Validate date range
 * @param {dayjs.Dayjs} startDate - Start date
 * @param {dayjs.Dayjs} endDate - End date
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Both dates are required' };
  }
  
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  if (!start.isValid() || !end.isValid()) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (end.isBefore(start)) {
    return { isValid: false, error: 'End date must be on or after start date' };
  }
  
  return { isValid: true, error: '' };
};
