export function toInputDateString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function isDateBeforeToday(value: string | Date): boolean {
  const d = typeof value === 'string' ? new Date(value) : value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function addYears(date: string | Date, years: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  d.setFullYear(d.getFullYear() + years);
  return d;
}
