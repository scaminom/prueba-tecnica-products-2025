import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isDateBeforeToday } from '../utils/date.utils';

export function dateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return isDateBeforeToday(control.value) ? { dateInvalid: true } : null;
  };
}

export function revisionOneYearAfterValidator(releaseControlName = 'date_release'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control?.value) return null;
    const parent = control.parent as any;
    const releaseControl: AbstractControl | null = parent?.get?.(releaseControlName) ?? null;
    if (!releaseControl || !releaseControl.value) return null;

    const release = new Date(releaseControl.value);
    const revision = new Date(control.value);

    const expected = new Date(release);
    expected.setFullYear(expected.getFullYear() + 1);

    const sameDay =
      expected.getFullYear() === revision.getFullYear() &&
      expected.getMonth() === revision.getMonth() &&
      expected.getDate() === revision.getDate();

    return sameDay ? null : { revisionMismatch: true };
  };
}
