import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductFormPageComponent } from './product-form.page';
import { ProductFacade } from '../../facade/product.facade';
import { signal } from '@angular/core';
import { of } from 'rxjs';

class ProductFacadeStub {
  loading = signal(false);
  error = signal<string | null>(null);
  private _selected: any = null;
  selectedProduct = signal<any>(null);

  verifyProductId(id: string) {
    return of(false);
  }
  createProduct = jasmine.createSpy('createProduct');
  updateProduct = jasmine.createSpy('updateProduct');
  navigateToList = jasmine.createSpy('navigateToList');
  navigateToEdit = jasmine.createSpy('navigateToEdit');

  selectProduct(p: any) {
    this._selected = p;
    this.selectedProduct.set(p);
  }
}

describe('ProductFormPageComponent', () => {
  let facade: ProductFacadeStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormPageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductFacade, useClass: ProductFacadeStub },
      ],
    }).compileComponents();

    facade = TestBed.inject(ProductFacade) as unknown as ProductFacadeStub;
  });

  it('should create and validate form', () => {
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const form = comp.productForm;
    expect(form).toBeTruthy();
    form.get('id')!.setValue('ab');
    expect(form.valid).toBeFalse();
  });

  it('should submit create when valid', () => {
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.productForm.setValue({
      id: 'abc',
      name: 'Producto Nombre',
      description: 'Descripción del producto',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    });

    comp.onSubmit();
    expect(facade.createProduct).toHaveBeenCalled();
  });

  it('should prefill and disable id in edit mode, and call update', () => {
    facade.selectProduct({
      id: 'abc',
      name: 'Nombre',
      description: 'Desc 123456789',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    });
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    comp['isEditMode'].set(true);
    comp['productId'].set('abc');
    comp['loadProductForEdit']('abc');
    fixture.detectChanges();

    expect(comp.productForm.get('id')!.disabled).toBeTrue();
    comp.productForm.patchValue({ name: 'Nuevo Nombre' });
    comp.onSubmit();
    expect(facade.updateProduct).toHaveBeenCalled();
  });

  it('should calculate date_revision +1 year when date_release changes', () => {
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.productForm.get('date_release')!.setValue('2099-05-10');
    comp.onDateReleaseChange();
    expect(comp.productForm.get('date_revision')!.value).toBe('2100-05-10');
  });

  it('should reset form and enable id in create mode', () => {
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.productForm.patchValue({ id: 'abc', name: 'x' });
    comp.onReset();
    expect(comp.productForm.get('id')!.enabled).toBeTrue();
    expect(comp.productForm.get('name')!.value).toBeNull();
  });

  it('should reset to selected product in edit mode and keep id disabled', () => {
    const product = {
      id: 'abc',
      name: 'Nombre',
      description: 'Desc 123456789',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    };
    facade.selectProduct(product);
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    comp['isEditMode'].set(true);
    comp['productId'].set('abc');
    comp['loadProductForEdit']('abc');
    fixture.detectChanges();

    comp.productForm.patchValue({ name: 'Otro' });
    comp.onReset();
    expect(comp.productForm.get('name')!.value).toBe('Nombre');
    expect(comp.productForm.get('id')!.disabled).toBeTrue();
  });

  it('should call navigateToList on cancel', () => {
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onCancel();
    expect(facade.navigateToList).toHaveBeenCalled();
  });

  it('should show error messages for required/min/max/pattern', () => {
    const fixture = TestBed.createComponent(ProductFormPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const form = comp.productForm;
    form.get('id')!.setValue('');
    form.get('name')!.setValue('abcd');
    form.get('description')!.setValue('short');
    form.get('logo')!.setValue('invalid');
    form.get('date_release')!.setValue('2000-01-01');
    form.get('date_revision')!.setValue('2001-01-01');

    comp.onSubmit();
    expect(comp.getFieldError('id', 'ID')).toBeTruthy();
    expect(comp.getFieldError('name', 'Nombre')).toBeTruthy();
    expect(comp.getFieldError('logo', 'Logo')).toBeTruthy();
    expect(comp.getFieldError('date_release', 'Fecha de Liberación')).toBeTruthy();
  });
});
