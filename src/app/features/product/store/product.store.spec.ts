import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';
import { Product } from '../../../shared/models/product';

const sample: Product = {
  id: 'x1',
  name: 'Nombre',
  description: 'Desc',
  logo: 'logo.png',
  date_release: '2025-01-01',
  date_revision: '2026-01-01',
};

describe('ProductStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should set loading', () => {
    const store = TestBed.inject(ProductStore);
    store.setLoading();
    expect(store.loading()).toBeTrue();
    expect(store.error()).toBeNull();
  });

  it('should set error', () => {
    const store = TestBed.inject(ProductStore);
    store.setError('Error message');
    expect(store.error()).toBe('Error message');
    expect(store.loading()).toBeFalse();
  });

  it('should clear error', () => {
    const store = TestBed.inject(ProductStore);
    store.setError('Error');
    store.clearError();
    expect(store.error()).toBeNull();
  });

  it('should set products', () => {
    const store = TestBed.inject(ProductStore);
    store.setProducts([sample]);
    expect(store.products().length).toBe(1);
    expect(store.loading()).toBeFalse();
  });

  it('should add product', () => {
    const store = TestBed.inject(ProductStore);
    store.addProduct(sample);
    expect(store.products().some((p) => p.id === sample.id)).toBeTrue();
  });

  it('should replace product', () => {
    const store = TestBed.inject(ProductStore);
    store.setProducts([sample]);
    store.replaceProduct('x1', { ...sample, name: 'Nuevo' });
    expect(store.products().find((p) => p.id === 'x1')?.name).toBe('Nuevo');
  });

  it('should remove product', () => {
    const store = TestBed.inject(ProductStore);
    store.setProducts([sample]);
    store.removeProduct('x1');
    expect(store.products().find((p) => p.id === 'x1')).toBeUndefined();
  });

  it('should select product', () => {
    const store = TestBed.inject(ProductStore);
    store.selectProduct(sample);
    expect(store.selectedProduct()).toEqual(sample);
    store.selectProduct(null);
    expect(store.selectedProduct()).toBeNull();
  });

  it('should compute isEmpty', () => {
    const store = TestBed.inject(ProductStore);
    expect(store.isEmpty()).toBeTrue();
    store.setProducts([sample]);
    expect(store.isEmpty()).toBeFalse();
  });

  it('should compute hasError', () => {
    const store = TestBed.inject(ProductStore);
    expect(store.hasError()).toBeFalse();
    store.setError('Error');
    expect(store.hasError()).toBeTrue();
  });
});
