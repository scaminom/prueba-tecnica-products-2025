import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { Product } from '../../../../shared/models/product';
import { buildProductForm } from '../../forms/product-form.factory';
import { toInputDateString, addYears } from '../../../../shared/utils/date.utils';
import { markFormGroupTouched, isControlInvalid } from '../../../../shared/utils/form.utils';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productStore = inject(ProductStore);

  isEditMode = signal(false);
  productId = signal<string | null>(null);
  loading = this.productStore.loading;
  error = this.productStore.error;

  productForm: FormGroup;

  constructor() {
    this.productForm = buildProductForm(this.fb, {
      verifyId: (id: string) => this.productStore.verifyProductId(id),
      isEditMode: this.isEditMode,
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.productId.set(params['id']);
        this.loadProductForEdit(params['id']);
      }
    });
  }

  private loadProductForEdit(id: string): void {
    const product = this.productStore.selectedProduct();
    if (product && product.id === id) {
      this.populateForm(product);
    } else {
      this.router.navigate(['/products']);
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
        // En edición no se debe enviar id
        const { id, ...rest } = formData as any;
        this.productStore.updateProduct({ id: this.productId()!, product: rest });
      } else {
        this.productStore.createProduct(formData);
      }

      this.router.navigate(['/products']);
    } else {
      markFormGroupTouched(this.productForm);
    }
  }

  onReset(): void {
    if (this.isEditMode()) {
      const product = this.productStore.selectedProduct();
      if (product) {
        this.populateForm(product);
      }
    } else {
      this.productForm.reset();
      this.productForm.get('id')?.enable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  isFieldInvalid(fieldName: string): boolean {
    return isControlInvalid(this.productForm.get(fieldName));
  }

  getFieldError(controlName: string, label?: string): string {
    const field = this.productForm.get(controlName);
    if (!field || !field.errors) return '';

    const fieldLabel = label ?? controlName;
    const errors = field.errors;

    if (errors['required']) return `${fieldLabel} es requerido`;
    if (errors['minlength'])
      return `${fieldLabel} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength'])
      return `${fieldLabel} debe tener máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['dateInvalid']) return 'La fecha debe ser igual o mayor a la fecha actual';
    if (errors['idExists']) return 'Este ID ya existe';
    if (errors['pattern']) return `${fieldLabel} no es válido`;

    return 'Campo inválido';
  }
}
