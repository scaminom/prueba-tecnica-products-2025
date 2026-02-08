import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { buildProductForm } from './product-form.factory';

describe('buildProductForm', () => {
  const fb = new FormBuilder();

  function createForm(isEdit = false) {
    return buildProductForm(fb, {
      verifyId: (id: string) => of(id === 'dup'),
      isEditMode: () => isEdit,
    });
  }

  it('should create form with controls', () => {
    const form = createForm();
    expect(form.get('id')).toBeTruthy();
    expect(form.get('name')).toBeTruthy();
    expect(form.get('description')).toBeTruthy();
    expect(form.get('logo')).toBeTruthy();
    expect(form.get('date_release')).toBeTruthy();
    expect(form.get('date_revision')).toBeTruthy();
  });

  it('should validate id required and async uniqueness', (done) => {
    const form = createForm();
    const id = form.get('id')!;
    id.setValue('');
    expect(id.valid).toBeFalse();
    id.setValue('dup');
    id.updateValueAndValidity();
    setTimeout(() => {
      expect(id.errors)?.toEqual({ idExists: true });
      done();
    }, 0);
  });

  it('should validate logo url pattern', () => {
    const form = createForm();
    const logo = form.get('logo')!;
    logo.setValue('invalid');
    expect(logo.valid).toBeFalse();
    logo.setValue('https://example.com/img.png');
    expect(logo.valid).toBeTrue();
  });

  it('should enforce revision being +1 year after release', () => {
    const form = createForm();
    form.get('date_release')!.setValue('2025-01-01');
    form.get('date_revision')!.setValue('2026-01-01');
    expect(form.get('date_revision')!.valid).toBeTrue();
    form.get('date_revision')!.setValue('2025-12-31');
    expect(form.get('date_revision')!.valid).toBeFalse();
  });

  it('should not validate id uniqueness in edit mode', (done) => {
    const form = createForm(true);
    const id = form.get('id')!;
    id.setValue('dup');
    id.updateValueAndValidity();
    setTimeout(() => {
      expect(id.errors).toBeNull();
      done();
    }, 0);
  });
});
