import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function uniqueProductIdValidator(
  verifyIdExists: (id: string) => Observable<boolean>,
  isEditMode: () => boolean
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || isEditMode()) {
      return of(null);
    }
    return verifyIdExists(control.value).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null))
    );
  };
}
