import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';
import { ProductService } from '../services/product.service';
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
  getProducts() {
    return of({ data: [sample] });
  }
  createProduct(product: Product) {
    return of({ data: product });
  }
  updateProduct(id: string, body: Omit<Product, 'id'>) {
    return of({ data: { ...body } as Product });
  }
  deleteProduct({ id }: { id: string }) {
    return of({});
  }
  verifyProductId({ id }: { id: string }) {
    return of(false);
  }
}

describe('ProductStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ProductService, useClass: ProductServiceStub }],
    });
  });

  it('should load products', (done) => {
    const store = TestBed.inject(ProductStore);
    store.loadProducts();
    setTimeout(() => {
      expect(store.products().length).toBe(1);
      expect(store.loading()).toBeFalse();
      done();
    }, 0);
  });

  it('should set error on load failure', (done) => {
    class FailingService extends ProductServiceStub {
      override getProducts() {
        return throwError(() => new Error('boom'));
      }
    }
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: ProductService, useClass: FailingService }],
    });
    const store = TestBed.inject(ProductStore);
    store.loadProducts();
    setTimeout(() => {
      expect(store.error()).toBeTruthy();
      expect(store.loading()).toBeFalse();
      done();
    }, 0);
  });

  it('should create product', (done) => {
    const store = TestBed.inject(ProductStore);
    store.createProduct(sample);
    setTimeout(() => {
      expect(store.products().some((p) => p.id === sample.id)).toBeTrue();
      done();
    }, 0);
  });

  it('should update product', (done) => {
    const store = TestBed.inject(ProductStore);
    store.loadProducts();
    setTimeout(() => {
      store.updateProduct({ id: 'x1', product: { ...sample, name: 'Nuevo' } });
      setTimeout(() => {
        expect(store.products().find((p) => p.id === 'x1')?.name).toBe('Nuevo');
        done();
      }, 0);
    }, 0);
  });

  it('should delete product', (done) => {
    const store = TestBed.inject(ProductStore);
    store.loadProducts();
    setTimeout(() => {
      store.deleteProduct('x1');
      setTimeout(() => {
        expect(store.products().find((p) => p.id === 'x1')).toBeUndefined();
        done();
      }, 0);
    }, 0);
  });

  it('should verify product id', (done) => {
    const store = TestBed.inject(ProductStore);
    store.verifyProductId('x1').subscribe((exists) => {
      expect(exists).toBeFalse();
      done();
    });
  });
});
