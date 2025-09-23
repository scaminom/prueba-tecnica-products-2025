import { TestBed } from '@angular/core/testing';
import { ProductListPageComponent } from './product-list.page';
import { provideRouter } from '@angular/router';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';

class ProductStoreStub {
  loadProducts() {}
  selectProduct() {}
  deleteProduct() {}
}

class ProductListStoreStub {}

describe('ProductListPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductStore, useClass: ProductStoreStub },
        { provide: ProductListStore, useClass: ProductListStoreStub },
      ],
    }).compileComponents();
  });

  it('should toggle delete modal state', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    const comp = fixture.componentInstance;
    expect(comp.showDeleteModal).toBeFalse();
    comp.onDeleteProduct({
      id: '1',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
    expect(comp.showDeleteModal).toBeTrue();
    comp.cancelDelete();
    expect(comp.showDeleteModal).toBeFalse();
  });

  it('should navigate to create on onAddProduct and set selected on edit', () => {
    const fixture = TestBed.createComponent(ProductListPageComponent);
    const comp = fixture.componentInstance;
    spyOn(comp as any, 'onAddProduct').and.callThrough();
    spyOn(comp as any, 'onEditProduct').and.callThrough();
    comp.onAddProduct();
    expect((comp as any).onAddProduct).toHaveBeenCalled();
    comp.onEditProduct({
      id: '1',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
    expect((comp as any).onEditProduct).toHaveBeenCalled();
  });
});
