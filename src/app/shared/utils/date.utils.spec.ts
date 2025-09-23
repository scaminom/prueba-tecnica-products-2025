import { addYears, isDateBeforeToday, toInputDateString } from './date.utils';

describe('date.utils', () => {
  it('toInputDateString formats date to yyyy-MM-dd', () => {
    const date = new Date('2025-01-02T10:00:00Z');
    expect(toInputDateString(date)).toBe('2025-01-02');
  });

  it('addYears adds 1 year preserving month/day', () => {
    const d = addYears('2025-02-28', 1);
    expect(toInputDateString(d)).toBe('2026-02-28');
  });

  it('isDateBeforeToday returns true for past', () => {
    expect(isDateBeforeToday('2000-01-01')).toBeTrue();
  });
});
