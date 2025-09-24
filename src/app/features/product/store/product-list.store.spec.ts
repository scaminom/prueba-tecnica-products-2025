import { TestBed } from '@angular/core/testing';
import { ProductListStore } from './product-list.store';
import { ProductStore } from './product.store';
import { signal } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { PRODUCT_LIST_SERVICE } from '../../../core/tokens/injection-tokens';

describe('ProductListStore', () => {
  const mockProducts: Product[] = [
    {
      id: 'a1',
      name: 'Alpha',
      description: 'Desc A',
      logo: 'a.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    },
    {
      id: 'b2',
      name: 'Beta',
      description: 'Desc B',
      logo: 'b.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
    {
      id: 'c3',
      name: 'Gamma',
      description: 'Desc C',
      logo: 'c.png',
      date_release: '2025-03-01',
      date_revision: '2026-03-01',
    },
  ];

  class ProductStoreStub {
    products = signal<Product[]>(mockProducts);
  }

  class ProductListServiceStub {
    filterProducts(products: Product[], searchTerm: string) {
      if (!searchTerm) return products;
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    paginateProducts(products: Product[], pageSize: number) {
      return products.slice(0, pageSize);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductStore, useClass: ProductStoreStub },
        { provide: PRODUCT_LIST_SERVICE, useClass: ProductListServiceStub },
      ],
    });
  });

  it('should filter by search term and paginate', () => {
    const store = TestBed.inject(ProductListStore);
    store.updateSearchTerm('a');
    store.updatePageSize(2);

    const filtered = store.filteredProducts();
    expect(filtered.length).toBe(3); // Alpha, Beta, Gamma
    expect(store.paginatedProducts().length).toBe(2); // pageSize limit
  });
});
