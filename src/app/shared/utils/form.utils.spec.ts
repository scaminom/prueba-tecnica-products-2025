import { FormControl, FormGroup } from '@angular/forms';
import { isControlInvalid, markFormGroupTouched } from './form.utils';

describe('form.utils', () => {
  it('markFormGroupTouched marks controls as touched', () => {
    const form = new FormGroup({
      a: new FormControl(''),
      b: new FormControl(''),
    });
    markFormGroupTouched(form);
    expect(form.get('a')!.touched).toBeTrue();
    expect(form.get('b')!.touched).toBeTrue();
  });

  it('isControlInvalid returns true for invalid and touched', () => {
    const c = new FormControl('');
    c.markAsTouched();
    expect(isControlInvalid(c)).toBeFalse();
    c.setErrors({ required: true });
    expect(isControlInvalid(c)).toBeTrue();
  });
});
