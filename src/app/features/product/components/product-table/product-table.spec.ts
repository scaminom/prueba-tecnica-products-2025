import { TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';
import { signal } from '@angular/core';
import { Product } from '../../../../shared/models/product';

class ProductStoreStub {
  private _loading = false;
  private _error: string | null = null;
  private _isEmpty = false;
  loading = () => this._loading;
  error = () => this._error;
  isEmpty = () => this._isEmpty;
  setLoading(v: boolean) {
    this._loading = v;
  }
  setError(v: string | null) {
    this._error = v;
  }
  setEmpty(v: boolean) {
    this._isEmpty = v;
  }
  clearError() {
    this._error = null;
  }
  loadProducts() {}
}

const products: Product[] = [
  {
    id: '1',
    name: 'A',
    description: 'D',
    logo: 'l.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  },
];

class ProductListStoreStub {
  paginatedProducts = signal<Product[]>(products);
  filteredCount = () => products.length;
  pageSize = () => 5;
}

describe('ProductTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent],
      providers: [
        { provide: ProductStore, useClass: ProductStoreStub },
        { provide: ProductListStore, useClass: ProductListStoreStub },
      ],
    }).compileComponents();
  });

  it('should render rows', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should render skeletons when loading', () => {
    const store = TestBed.inject(ProductStore) as unknown as ProductStoreStub;
    store.setLoading(true);
    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });

  it('should render error container when error present', () => {
    const store = TestBed.inject(ProductStore) as unknown as ProductStoreStub;
    store.setError('Error');
    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-container')).toBeTruthy();
  });

  it('should emit onEdit and onDelete from actions', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const comp = fixture.componentInstance;
    spyOn(comp.onEditProduct, 'emit');
    spyOn(comp.onDeleteProduct, 'emit');
    fixture.detectChanges();

    comp.onEdit(products[0]);
    comp.onDelete(products[0]);
    expect(comp.onEditProduct.emit).toHaveBeenCalled();
    expect(comp.onDeleteProduct.emit).toHaveBeenCalled();
  });

  it('should emit onPageSizeChange when select changes', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const comp = fixture.componentInstance;
    spyOn(comp.onPageSizeChange, 'emit');
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('.page-size-select') as HTMLSelectElement;
    select.value = '10';
    select.dispatchEvent(new Event('change'));
    expect(comp.onPageSizeChange.emit).toHaveBeenCalledWith(10);
  });

  it('should toggle and close dropdown', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    comp.toggleDropdown('1');
    expect(comp.openDropdownId).toBe('1');
    comp.toggleDropdown('1');
    expect(comp.openDropdownId).toBeNull();
    comp.toggleDropdown('1');
    comp.closeDropdown();
    expect(comp.openDropdownId).toBeNull();
  });

  it('trackByProductId should return product id', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const comp = fixture.componentInstance;
    const id = comp.trackByProductId(0, products[0]);
    expect(id).toBe('1');
  });
});
