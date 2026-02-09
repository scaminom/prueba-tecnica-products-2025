import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { uniqueProductIdValidator } from '../validators/unique-product-id.validator';
import {
  dateNotPastValidator,
  revisionOneYearAfterValidator,
} from '../../../shared/validators/date.validators';

type VerifyIdFn = (id: string) => import('rxjs').Observable<boolean>;

export function buildProductForm(
  fb: FormBuilder,
  options: { verifyId: VerifyIdFn; isEditMode: () => boolean }
): FormGroup {
  const idControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    asyncValidators: [uniqueProductIdValidator(options.verifyId, options.isEditMode)],
    updateOn: 'blur',
  });

  const form = fb.group({
    id: idControl,
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: [
      '',
      [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w.-]+)\.[a-z]{2,}(\S*)$/i)],
    ],
    date_release: ['', [Validators.required, dateNotPastValidator()]],
    date_revision: ['', [Validators.required, revisionOneYearAfterValidator('date_release')]],
  });

  return form;
}
