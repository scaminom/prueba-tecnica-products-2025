import { AbstractControl } from '@angular/forms';

export function markFormGroupTouched(control: AbstractControl | null): void {
  if (!control) return;
  if (typeof (control as any).markAsTouched === 'function') {
    (control as any).markAsTouched();
  }
  const controls = (control as any).controls as Record<string, AbstractControl> | undefined;
  if (controls) {
    Object.values(controls).forEach(markFormGroupTouched);
  }
}

export function isControlInvalid(control: AbstractControl | null): boolean {
  return !!(control && control.invalid && (control.dirty || control.touched));
}
