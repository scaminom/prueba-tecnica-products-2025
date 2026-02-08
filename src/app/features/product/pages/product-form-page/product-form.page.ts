import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../../../shared/models/product';
import { buildProductForm } from '../../forms/product-form.factory';
import { toInputDateString, addYears } from '../../../../shared/utils/date.utils';
import { markFormGroupTouched, isControlInvalid } from '../../../../shared/utils/form.utils';
import { FormErrorService } from '../../../../shared/services/form-error.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-form-page',
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './product-form.page.html',
  styleUrl: './product-form.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ProductFacade);
  private readonly formErrorService = inject(FormErrorService);
  private readonly destroyRef = inject(DestroyRef);

  isEditMode = signal(false);
  productId = signal<string | null>(null);
  loading = this.facade.loading;
  error = this.facade.error;

  productForm: FormGroup;

  constructor() {
    this.productForm = buildProductForm(this.fb, {
      verifyId: (id: string) => this.facade.verifyProductId(id),
      isEditMode: this.isEditMode,
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['id']) {
          this.isEditMode.set(true);
          this.productId.set(params['id']);
          this.loadProductForEdit(params['id']);
        }
      });
  }

  private loadProductForEdit(id: string): void {
    const product = this.facade.selectedProduct();
    if (product && product.id === id) {
      this.populateForm(product);
    } else {
      this.facade.navigateToList();
    }
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: toInputDateString(product.date_release),
      date_revision: toInputDateString(product.date_revision),
    });

    this.productForm.get('id')?.disable();
  }

  onDateReleaseChange(): void {
    const dateReleaseControl = this.productForm.get('date_release');
    const dateRevisionControl = this.productForm.get('date_revision');

    if (dateReleaseControl?.value && dateReleaseControl.valid) {
      const releaseDate = new Date(dateReleaseControl.value);
      const revisionDate = addYears(releaseDate, 1);
      dateRevisionControl?.setValue(toInputDateString(revisionDate));
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.getRawValue();

      if (this.isEditMode()) {
        const { id, ...rest } = formData as any;
        this.facade.updateProduct(this.productId()!, rest);
      } else {
        this.facade.createProduct(formData);
      }
    } else {
      markFormGroupTouched(this.productForm);
    }
  }

  onReset(): void {
    if (this.isEditMode()) {
      const product = this.facade.selectedProduct();
      if (product) {
        this.populateForm(product);
      }
    } else {
      this.productForm.reset();
      this.productForm.get('id')?.enable();
    }
  }

  onCancel(): void {
    this.facade.navigateToList();
  }

  isFieldInvalid(fieldName: string): boolean {
    return isControlInvalid(this.productForm.get(fieldName));
  }

  getFieldError(controlName: string, label?: string): string {
    const field = this.productForm.get(controlName);
    if (!field || !field.errors) return '';

    const fieldLabel = label ?? controlName;
    return this.formErrorService.getErrorMessage(field.errors, fieldLabel);
  }
}
