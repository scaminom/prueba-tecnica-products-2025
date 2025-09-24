import { TestBed } from '@angular/core/testing';
import { ProductListService } from './product-list.service';
import { Product } from '../../../shared/models/product';

describe('ProductListService', () => {
  let service: ProductListService;

  const mockProducts: Product[] = [
    {
      id: 'alpha-id',
      name: 'Alpha Product',
      description: 'Alpha description with keywords',
      logo: 'alpha-logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    },
    {
      id: 'beta-id',
      name: 'Beta Product',
      description: 'Beta description',
      logo: 'beta-logo.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
    {
      id: 'gamma-id',
      name: 'Gamma Product',
      description: 'Gamma description with special keywords',
      logo: 'gamma-logo.png',
      date_release: '2025-03-01',
      date_revision: '2026-03-01',
    },
    {
      id: 'delta-id',
      name: 'Delta Product',
      description: 'Delta description',
      logo: 'delta-logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductListService],
    });
    service = TestBed.inject(ProductListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filterProducts', () => {
    it('should return all products when search term is empty', () => {
      const result = service.filterProducts(mockProducts, '');
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(4);
    });

    it('should return all products when search term is null', () => {
      const result = service.filterProducts(mockProducts, null as any);
      expect(result).toEqual(mockProducts);
    });

    it('should return all products when search term is undefined', () => {
      const result = service.filterProducts(mockProducts, undefined as any);
      expect(result).toEqual(mockProducts);
    });

    it('should return all products when search term is only whitespace', () => {
      const result = service.filterProducts(mockProducts, '   ');
      expect(result).toEqual(mockProducts);
    });

    it('should filter by product name (case insensitive)', () => {
      const result = service.filterProducts(mockProducts, 'alpha');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alpha Product');
    });

    it('should filter by product name (uppercase)', () => {
      const result = service.filterProducts(mockProducts, 'BETA');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Beta Product');
    });

    it('should filter by product description', () => {
      const result = service.filterProducts(mockProducts, 'keywords');
      expect(result.length).toBe(2);
      expect(result.map((p) => p.name)).toContain('Alpha Product');
      expect(result.map((p) => p.name)).toContain('Gamma Product');
    });

    it('should filter by product ID', () => {
      const result = service.filterProducts(mockProducts, 'delta-id');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('delta-id');
    });

    it('should filter by partial product ID', () => {
      const result = service.filterProducts(mockProducts, 'beta');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('beta-id');
    });

    it('should return empty array when no matches found', () => {
      const result = service.filterProducts(mockProducts, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('should handle partial matches in name', () => {
      const result = service.filterProducts(mockProducts, 'prod');
      expect(result.length).toBe(4);
    });

    it('should handle partial matches in description', () => {
      const result = service.filterProducts(mockProducts, 'special');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Gamma Product');
    });

    it('should trim search term before filtering', () => {
      const result = service.filterProducts(mockProducts, '  alpha  ');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alpha Product');
    });

    it('should handle empty products array', () => {
      const result = service.filterProducts([], 'anything');
      expect(result).toEqual([]);
    });

    it('should search across multiple fields simultaneously', () => {
      const result = service.filterProducts(mockProducts, 'gamma');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('gamma-id');
    });
  });

  describe('paginateProducts', () => {
    it('should return first N products when pageSize is less than total', () => {
      const result = service.paginateProducts(mockProducts, 2);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(mockProducts[0]);
      expect(result[1]).toEqual(mockProducts[1]);
    });

    it('should return all products when pageSize equals total', () => {
      const result = service.paginateProducts(mockProducts, 4);
      expect(result.length).toBe(4);
      expect(result).toEqual(mockProducts);
    });

    it('should return all products when pageSize is greater than total', () => {
      const result = service.paginateProducts(mockProducts, 10);
      expect(result.length).toBe(4);
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when pageSize is 0', () => {
      const result = service.paginateProducts(mockProducts, 0);
      expect(result).toEqual([]);
    });

    it('should return products without last element when pageSize is -1', () => {
      const result = service.paginateProducts(mockProducts, -1);
      expect(result.length).toBe(3);
      expect(result).toEqual(mockProducts.slice(0, -1));
    });

    it('should handle empty products array', () => {
      const result = service.paginateProducts([], 5);
      expect(result).toEqual([]);
    });

    it('should return single product when pageSize is 1', () => {
      const result = service.paginateProducts(mockProducts, 1);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(mockProducts[0]);
    });

    it('should maintain original order of products', () => {
      const result = service.paginateProducts(mockProducts, 3);
      expect(result[0]).toEqual(mockProducts[0]);
      expect(result[1]).toEqual(mockProducts[1]);
      expect(result[2]).toEqual(mockProducts[2]);
    });
  });

  describe('sortProducts', () => {
    it('should sort by name in ascending order', () => {
      const result = service.sortProducts(mockProducts, 'name', 'asc');
      expect(result.length).toBe(4);
      expect(result[0].name).toBe('Alpha Product');
      expect(result[1].name).toBe('Beta Product');
      expect(result[2].name).toBe('Delta Product');
      expect(result[3].name).toBe('Gamma Product');
    });

    it('should sort by name in descending order', () => {
      const result = service.sortProducts(mockProducts, 'name', 'desc');
      expect(result.length).toBe(4);
      expect(result[0].name).toBe('Gamma Product');
      expect(result[1].name).toBe('Delta Product');
      expect(result[2].name).toBe('Beta Product');
      expect(result[3].name).toBe('Alpha Product');
    });

    it('should sort by id in ascending order', () => {
      const result = service.sortProducts(mockProducts, 'id', 'asc');
      expect(result[0].id).toBe('alpha-id');
      expect(result[1].id).toBe('beta-id');
      expect(result[2].id).toBe('delta-id');
      expect(result[3].id).toBe('gamma-id');
    });

    it('should sort by id in descending order', () => {
      const result = service.sortProducts(mockProducts, 'id', 'desc');
      expect(result[0].id).toBe('gamma-id');
      expect(result[1].id).toBe('delta-id');
      expect(result[2].id).toBe('beta-id');
      expect(result[3].id).toBe('alpha-id');
    });

    it('should sort by date_release in ascending order', () => {
      const result = service.sortProducts(mockProducts, 'date_release', 'asc');
      expect(result[0].date_release).toBe('2024-01-01');
      expect(result[1].date_release).toBe('2025-01-01');
      expect(result[2].date_release).toBe('2025-02-01');
      expect(result[3].date_release).toBe('2025-03-01');
    });

    it('should sort by date_release in descending order', () => {
      const result = service.sortProducts(mockProducts, 'date_release', 'desc');
      expect(result[0].date_release).toBe('2025-03-01');
      expect(result[1].date_release).toBe('2025-02-01');
      expect(result[2].date_release).toBe('2025-01-01');
      expect(result[3].date_release).toBe('2024-01-01');
    });

    it('should sort by description in ascending order', () => {
      const result = service.sortProducts(mockProducts, 'description', 'asc');
      expect(result[0].description).toBe('Alpha description with keywords');
      expect(result[1].description).toBe('Beta description');
      expect(result[2].description).toBe('Delta description');
      expect(result[3].description).toBe('Gamma description with special keywords');
    });

    it('should not mutate original array', () => {
      const originalOrder = [...mockProducts];
      const result = service.sortProducts(mockProducts, 'name', 'desc');

      expect(mockProducts).toEqual(originalOrder);
      expect(result).not.toBe(mockProducts);
    });

    it('should handle empty array', () => {
      const result = service.sortProducts([], 'name', 'asc');
      expect(result).toEqual([]);
    });

    it('should handle single item array', () => {
      const singleItem = [mockProducts[0]];
      const result = service.sortProducts(singleItem, 'name', 'asc');
      expect(result).toEqual(singleItem);
      expect(result).not.toBe(singleItem);
    });

    it('should handle products with same values', () => {
      const duplicateProducts: Product[] = [
        { ...mockProducts[0], name: 'Same Name' },
        { ...mockProducts[1], name: 'Same Name' },
        { ...mockProducts[2], name: 'Different Name' },
      ];

      const result = service.sortProducts(duplicateProducts, 'name', 'asc');
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Different Name');
      expect(result[1].name).toBe('Same Name');
      expect(result[2].name).toBe('Same Name');
    });
  });

  describe('integration scenarios', () => {
    it('should work with filter and pagination together', () => {
      const filtered = service.filterProducts(mockProducts, 'product');
      const paginated = service.paginateProducts(filtered, 2);

      expect(paginated.length).toBe(2);
      expect(paginated[0]).toEqual(mockProducts[0]);
      expect(paginated[1]).toEqual(mockProducts[1]);
    });

    it('should work with filter and sorting together', () => {
      const filtered = service.filterProducts(mockProducts, 'product');
      const sorted = service.sortProducts(filtered, 'name', 'desc');

      expect(sorted.length).toBe(4);
      expect(sorted[0].name).toBe('Gamma Product');
      expect(sorted[3].name).toBe('Alpha Product');
    });

    it('should work with all operations together', () => {
      const filtered = service.filterProducts(mockProducts, 'product');
      const sorted = service.sortProducts(filtered, 'name', 'asc');
      const paginated = service.paginateProducts(sorted, 2);

      expect(paginated.length).toBe(2);
      expect(paginated[0].name).toBe('Alpha Product');
      expect(paginated[1].name).toBe('Beta Product');
    });

    it('should handle edge case: filter returns empty, then paginate', () => {
      const filtered = service.filterProducts(mockProducts, 'nonexistent');
      const paginated = service.paginateProducts(filtered, 5);

      expect(paginated).toEqual([]);
    });

    it('should handle edge case: filter returns one item, then sort and paginate', () => {
      const filtered = service.filterProducts(mockProducts, 'alpha');
      const sorted = service.sortProducts(filtered, 'name', 'desc');
      const paginated = service.paginateProducts(sorted, 10);

      expect(paginated.length).toBe(1);
      expect(paginated[0].name).toBe('Alpha Product');
    });
  });
});
