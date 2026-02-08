import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductTableComponent } from './product-table';
import { Product } from '../../../../shared/models/product';

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

describe('ProductTableComponent', () => {
  let fixture: ComponentFixture<ProductTableComponent>;
  let comp: ProductTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    comp = fixture.componentInstance;
  });

  function setDefaultInputs(overrides: Partial<{
    products: Product[];
    loading: boolean;
    error: string | null;
    isEmpty: boolean;
    productsCount: number;
    pageSize: number;
  }> = {}): void {
    fixture.componentRef.setInput('products', overrides.products ?? products);
    fixture.componentRef.setInput('loading', overrides.loading ?? false);
    fixture.componentRef.setInput('error', overrides.error ?? null);
    fixture.componentRef.setInput('isEmpty', overrides.isEmpty ?? false);
    fixture.componentRef.setInput('productsCount', overrides.productsCount ?? products.length);
    fixture.componentRef.setInput('pageSize', overrides.pageSize ?? 5);
    fixture.detectChanges();
  }

  it('should render rows', () => {
    setDefaultInputs();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should render skeletons when loading', () => {
    setDefaultInputs({ loading: true });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });

  it('should render error container when error present', () => {
    setDefaultInputs({ error: 'Error' });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-container')).toBeTruthy();
  });

  it('should render empty state when isEmpty', () => {
    setDefaultInputs({ isEmpty: true, products: [] });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });

  it('should emit editProduct and deleteProduct from actions', () => {
    setDefaultInputs();
    spyOn(comp.editProduct, 'emit');
    spyOn(comp.deleteProduct, 'emit');

    comp.onEdit(products[0]);
    comp.onDelete(products[0]);
    expect(comp.editProduct.emit).toHaveBeenCalled();
    expect(comp.deleteProduct.emit).toHaveBeenCalled();
  });

  it('should emit pageSizeChange when select changes', () => {
    setDefaultInputs();
    spyOn(comp.pageSizeChange, 'emit');
    const select = fixture.nativeElement.querySelector('.page-size-select') as HTMLSelectElement;
    select.value = '10';
    select.dispatchEvent(new Event('change'));
    expect(comp.pageSizeChange.emit).toHaveBeenCalledWith(10);
  });

  it('should emit retryLoad on retry button click', () => {
    setDefaultInputs({ error: 'Error' });
    spyOn(comp.retryLoad, 'emit');
    const btn = fixture.nativeElement.querySelector('.btn-retry') as HTMLButtonElement;
    btn.click();
    expect(comp.retryLoad.emit).toHaveBeenCalled();
  });

  it('should toggle and close dropdown', () => {
    setDefaultInputs();
    comp.toggleDropdown('1');
    expect(comp.openDropdownId()).toBe('1');
    comp.toggleDropdown('1');
    expect(comp.openDropdownId()).toBeNull();
    comp.toggleDropdown('1');
    comp.closeDropdown();
    expect(comp.openDropdownId()).toBeNull();
  });
});
