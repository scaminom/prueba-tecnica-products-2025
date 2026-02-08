import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductFacade } from './product.facade';
import { NotificationService } from '../../../shared/services/notification.service';
import { PRODUCT_SERVICE, PRODUCT_LIST_SERVICE } from '../../../core/tokens/injection-tokens';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../../shared/models/product';

const sample: Product = {
  id: 'x1',
  name: 'Nombre',
  description: 'Desc',
  logo: 'logo.png',
  date_release: '2025-01-01',
  date_revision: '2026-01-01',
};

class ProductServiceStub {
  getProducts = jasmine.createSpy('getProducts').and.returnValue(of({ data: [sample] }));
  createProduct = jasmine.createSpy('createProduct').and.returnValue(of({ data: sample }));
  updateProduct = jasmine.createSpy('updateProduct').and.returnValue(of({ data: sample }));
  deleteProduct = jasmine.createSpy('deleteProduct').and.returnValue(of({}));
  verifyProductId = jasmine.createSpy('verifyProductId').and.returnValue(of({ data: false }));
}

class ProductListServiceStub {
  filterProducts(products: Product[], searchTerm: string) {
    if (!searchTerm) return products;
    return products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  paginateProducts(products: Product[], pageSize: number) {
    return products.slice(0, pageSize);
  }
}

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let productService: ProductServiceStub;
  let router: Router;
  let notifications: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductFacade,
        { provide: PRODUCT_SERVICE, useClass: ProductServiceStub },
        { provide: PRODUCT_LIST_SERVICE, useClass: ProductListServiceStub },
      ],
    });

    facade = TestBed.inject(ProductFacade);
    productService = TestBed.inject(PRODUCT_SERVICE) as unknown as ProductServiceStub;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(NotificationService);
  });

  it('should load products', () => {
    facade.loadProducts();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(facade.loading()).toBeFalse();
    expect(facade.products().length).toBeGreaterThanOrEqual(0);
  });

  it('should handle load error', () => {
    productService.getProducts.and.returnValue(throwError(() => new Error('fail')));
    facade.loadProducts();
    expect(facade.error()).toBeTruthy();
  });

  it('should create product and navigate', () => {
    spyOn(router, 'navigate');
    facade.createProduct(sample);
    expect(productService.createProduct).toHaveBeenCalledWith(sample);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle create error', () => {
    productService.createProduct.and.returnValue(throwError(() => new Error('fail')));
    spyOn(notifications, 'error');
    facade.createProduct(sample);
    expect(notifications.error).toHaveBeenCalled();
  });

  it('should update product and navigate', () => {
    spyOn(router, 'navigate');
    const { id, ...rest } = sample;
    facade.updateProduct(id, rest);
    expect(productService.updateProduct).toHaveBeenCalledWith(id, rest);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should delete product and notify', () => {
    spyOn(notifications, 'success');
    facade.deleteProduct('x1');
    expect(productService.deleteProduct).toHaveBeenCalledWith({ id: 'x1' });
    expect(notifications.success).toHaveBeenCalled();
  });

  it('should verify product id', (done) => {
    facade.verifyProductId('x1').subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  });

  it('should debounce search changes', fakeAsync(() => {
    facade.onSearchChange('a');
    facade.onSearchChange('ab');
    facade.onSearchChange('abc');
    tick(300);
    expect(facade.searchTerm()).toBe('abc');
  }));

  it('should update page size', () => {
    facade.updatePageSize(10);
    expect(facade.pageSize()).toBe(10);
  });

  it('should navigate to create', () => {
    spyOn(router, 'navigate');
    facade.navigateToCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/products/create']);
  });

  it('should navigate to edit', () => {
    spyOn(router, 'navigate');
    facade.navigateToEdit(sample);
    expect(router.navigate).toHaveBeenCalledWith(['/products/edit', 'x1']);
  });

  it('should retry load', () => {
    spyOn(facade, 'loadProducts');
    facade.retryLoad();
    expect(facade.error()).toBeNull();
    expect(facade.loadProducts).toHaveBeenCalled();
  });
});
