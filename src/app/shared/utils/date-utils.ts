//This could come from a service or the backend - I had to hardcode for time constraints
export const publicHolidaySet = new Set<string>([
  '2025-01-01', '2025-03-21', '2025-04-18', '2025-04-21',
  '2025-04-27', '2025-04-28', '2025-05-01', '2025-06-16',
  '2025-08-09', '2025-09-24', '2025-12-16', '2025-12-25', '2025-12-26'
]);

export function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isPublicHoliday(date: Date): boolean {
  const iso = toIsoDate(date);
  return publicHolidaySet.has(iso);
}

export function formatToDateInput(date: string | Date): string {
  const d = new Date(date);
  return toIsoDate(d);
}

export function countWorkingDays(start: string, end: string): number {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  let count = 0;

  for (
    let d = new Date(startDate.getTime());
    d <= endDate;
    d = new Date(d.getTime() + 86400000)
  ) {
    if (!isWeekend(d) && !isPublicHoliday(d)) {
      count++;
    }
  }

  return count;
}
