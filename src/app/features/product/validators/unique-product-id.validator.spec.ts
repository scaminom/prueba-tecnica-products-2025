import { FormControl, ValidationErrors } from '@angular/forms';
import { of, throwError, firstValueFrom, Observable } from 'rxjs';
import { uniqueProductIdValidator } from './unique-product-id.validator';

describe('uniqueProductIdValidator', () => {
  async function runValidator(
    exists$: Observable<boolean>,
    isEdit: boolean
  ): Promise<ValidationErrors | null> {
    const validator = uniqueProductIdValidator(
      () => exists$,
      () => isEdit
    );
    const result = validator(
      new FormControl('abc')
    ) as unknown as Observable<ValidationErrors | null>;
    return await firstValueFrom(result);
  }

  it('should return null when in edit mode', async () => {
    const res = await runValidator(of(true), true);
    expect(res).toBeNull();
  });

  it('should return error when id exists', async () => {
    const res = await runValidator(of(true), false);
    expect(res).toEqual({ idExists: true });
  });

  it('should return null when id does not exist', async () => {
    const res = await runValidator(of(false), false);
    expect(res).toBeNull();
  });

  it('should return null on service error', async () => {
    const res = await runValidator(
      throwError(() => new Error('x')),
      false
    );
    expect(res).toBeNull();
  });
});
