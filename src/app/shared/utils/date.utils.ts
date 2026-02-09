export function toInputDateString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function isDateBeforeToday(value: string | Date): boolean {
  const date = typeof value === 'string' ? new Date(value) : value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function addYears(date: string | Date, years: number): Date {
  const parsedDate = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  parsedDate.setFullYear(parsedDate.getFullYear() + years);
  return parsedDate;
}
