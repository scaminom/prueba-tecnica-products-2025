import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductFormComponent } from './product-form';
import { ProductStore } from '../../store/product.store';
import { of } from 'rxjs';

class ProductStoreStub {
  loading = () => false;
  error = () => null;
  private _selected: any = null;
  selectedProduct = () => this._selected;
  verifyProductId(id: string) {
    return of(false);
  }
  createProduct = jasmine.createSpy('createProduct');
  updateProduct = jasmine.createSpy('updateProduct');
  selectProduct(p: any) {
    this._selected = p;
  }
}

describe('ProductFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [provideRouter([]), { provide: ProductStore, useClass: ProductStoreStub }],
    }).compileComponents();
  });

  it('should create and validate form', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const form = comp.productForm;
    expect(form).toBeTruthy();
    form.get('id')!.setValue('ab');
    expect(form.valid).toBeFalse();
  });

  it('should submit create when valid', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const comp = fixture.componentInstance;
    const store = TestBed.inject(ProductStore) as unknown as ProductStoreStub;
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
    expect(store.createProduct).toHaveBeenCalled();
  });

  it('should prefill and disable id in edit mode, and call update', () => {
    const store = TestBed.inject(ProductStore) as unknown as ProductStoreStub;
    store.selectProduct({
      id: 'abc',
      name: 'Nombre',
      description: 'Desc 123456789',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    });
    const fixture = TestBed.createComponent(ProductFormComponent);
    const comp = fixture.componentInstance;
    // Simula URL /edit/abc
    comp['isEditMode'].set(true);
    comp['productId'].set('abc');
    comp['loadProductForEdit']('abc');
    fixture.detectChanges();

    expect(comp.productForm.get('id')!.disabled).toBeTrue();
    comp.productForm.patchValue({ name: 'Nuevo Nombre' });
    comp.onSubmit();
    expect(store.updateProduct).toHaveBeenCalled();
  });

  it('should calculate date_revision +1 year when date_release changes', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.productForm.get('date_release')!.setValue('2099-05-10');
    comp.onDateReleaseChange();
    expect(comp.productForm.get('date_revision')!.value).toBe('2100-05-10');
  });

  it('should reset form and enable id in create mode', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.productForm.patchValue({ id: 'abc', name: 'x' });
    comp.onReset();
    expect(comp.productForm.get('id')!.enabled).toBeTrue();
    expect(comp.productForm.get('name')!.value).toBeNull();
  });

  it('should reset to selected product in edit mode and keep id disabled', () => {
    const store = TestBed.inject(ProductStore) as unknown as ProductStoreStub;
    const product = {
      id: 'abc',
      name: 'Nombre',
      description: 'Desc 123456789',
      logo: 'https://example.com/logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    };
    store.selectProduct(product);
    const fixture = TestBed.createComponent(ProductFormComponent);
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

  it('should show error messages for required/min/max/pattern', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const form = comp.productForm;
    form.get('id')!.setValue(''); // required fail
    form.get('name')!.setValue('abcd'); // minlength fail
    form.get('description')!.setValue('short'); // minlength fail
    form.get('logo')!.setValue('invalid'); // pattern fail
    form.get('date_release')!.setValue('2000-01-01'); // past
    form.get('date_revision')!.setValue('2001-01-01'); // not +1 year (depends on date_release)

    comp.onSubmit();
    // Comprobamos que getFieldError devuelve mensajes para algunos campos
    expect(comp.getFieldError('id', 'ID')).toBeTruthy();
    expect(comp.getFieldError('name', 'Nombre')).toBeTruthy();
    expect(comp.getFieldError('logo', 'Logo')).toBeTruthy();
    expect(comp.getFieldError('date_release', 'Fecha de Liberación')).toBeTruthy();
  });
});
