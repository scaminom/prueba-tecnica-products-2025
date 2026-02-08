import { TestBed } from '@angular/core/testing';
import { ProductListPageComponent } from './product-list.page';
import { ProductFacade } from '../../facade/product.facade';
import { signal } from '@angular/core';

class ProductFacadeStub {
  products = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  isEmpty = signal(false);
  filteredCount = signal(0);
  pageSize = signal(5);
  searchTerm = signal('');
  selectedProduct = signal(null);

  loadProducts = jasmine.createSpy('loadProducts');
  navigateToCreate = jasmine.createSpy('navigateToCreate');
  navigateToEdit = jasmine.createSpy('navigateToEdit');
  navigateToList = jasmine.createSpy('navigateToList');
  onSearchChange = jasmine.createSpy('onSearchChange');
  updatePageSize = jasmine.createSpy('updatePageSize');
  deleteProduct = jasmine.createSpy('deleteProduct');
  retryLoad = jasmine.createSpy('retryLoad');
}

describe('ProductListPageComponent', () => {
  let facade: ProductFacadeStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [{ provide: ProductFacade, useClass: ProductFacadeStub }],
    }).compileComponents();

    facade = TestBed.inject(ProductFacade) as unknown as ProductFacadeStub;
  });

  it('should load products on init', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    fixture.detectChanges();
    expect(facade.loadProducts).toHaveBeenCalled();
  });

  it('should toggle delete modal state', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    expect(comp.showDeleteModal()).toBeFalse();
    comp.onDeleteProduct({
      id: '1',
      name: 'Test',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
    expect(comp.showDeleteModal()).toBeTrue();
    comp.cancelDelete();
    expect(comp.showDeleteModal()).toBeFalse();
  });

  it('should call facade.navigateToCreate on onAddProduct', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onAddProduct();
    expect(facade.navigateToCreate).toHaveBeenCalled();
  });

  it('should call facade.navigateToEdit on onEditProduct', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    fixture.detectChanges();
    const product = {
      id: '1',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    fixture.componentInstance.onEditProduct(product);
    expect(facade.navigateToEdit).toHaveBeenCalledWith(product);
  });

  it('should call facade.deleteProduct on confirmDelete', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    comp.onDeleteProduct({
      id: '1',
      name: 'Test',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
    comp.confirmDelete();
    expect(facade.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should call facade.retryLoad on onRetryLoad', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onRetryLoad();
    expect(facade.retryLoad).toHaveBeenCalled();
  });

  it('should call facade.onSearchChange', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearchChange('test');
    expect(facade.onSearchChange).toHaveBeenCalledWith('test');
  });

  it('should call facade.updatePageSize', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    fixture.detectChanges();
    fixture.componentInstance.onPageSizeChange(10);
    expect(facade.updatePageSize).toHaveBeenCalledWith(10);
  });
});
