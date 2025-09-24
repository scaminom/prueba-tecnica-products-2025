import { FormControl, FormGroup } from '@angular/forms';
import { dateNotPastValidator, revisionOneYearAfterValidator } from './date.validators';

describe('date.validators', () => {
  it('dateNotPastValidator should invalidate past dates', () => {
    const control = new FormControl('2000-01-01');
    const validator = dateNotPastValidator();
    expect(validator(control)).toEqual({ dateInvalid: true });
  });

  it('dateNotPastValidator should allow today/future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().split('T')[0];
    const control = new FormControl(iso);
    const validator = dateNotPastValidator();
    expect(validator(control)).toBeNull();
  });

  it('revisionOneYearAfterValidator should validate exactly +1 year', () => {
    const form = new FormGroup({
      date_release: new FormControl('2025-01-01'),
      date_revision: new FormControl('2026-01-01'),
    });
    const control = form.get('date_revision')!;
    const validator = revisionOneYearAfterValidator('date_release');
    expect(validator(control)).toBeNull();
  });

  it('revisionOneYearAfterValidator should fail when not +1 year', () => {
    const form = new FormGroup({
      date_release: new FormControl('2025-01-01'),
      date_revision: new FormControl('2025-12-31'),
    });
    const control = form.get('date_revision')!;
    const validator = revisionOneYearAfterValidator('date_release');
    expect(validator(control)).toEqual({ revisionMismatch: true });
  });
});
