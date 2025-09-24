import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpProductRepository } from './http-product.repository';
import { API_CONFIG } from '../../../core/tokens/injection-tokens';
import { Product } from '../../../shared/models/product';

describe('HttpProductRepository', () => {
  let repository: HttpProductRepository;
  let httpMock: HttpTestingController;
  const mockApiConfig = { baseUrl: 'http://test-api.com' };

  const mockProduct: Product = {
    id: 'test-id',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      id: 'test-id-2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      logo: 'test-logo-2.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpProductRepository, { provide: API_CONFIG, useValue: mockApiConfig }],
    });

    repository = TestBed.inject(HttpProductRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('findAll', () => {
    it('should return products array when API returns data', (done) => {
      const mockResponse = { data: mockProducts };

      repository.findAll().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array when API returns no data', (done) => {
      const mockResponse = {};

      repository.findAll().subscribe((products) => {
        expect(products).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products`);
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      repository.findAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('findById', () => {
    it('should return product when found', (done) => {
      const mockResponse = { data: mockProduct };

      repository.findById('test-id').subscribe((product) => {
        expect(product).toEqual(mockProduct);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/test-id`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return null when product not found', (done) => {
      const mockResponse = {};

      repository.findById('non-existent').subscribe((product) => {
        expect(product).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/non-existent`);
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      repository.findById('test-id').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/test-id`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('save', () => {
    it('should create product successfully', (done) => {
      const mockResponse = { data: mockProduct };

      repository.save(mockProduct).subscribe((product) => {
        expect(product).toEqual(mockProduct);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockResponse);
    });

    it('should handle creation error', (done) => {
      repository.save(mockProduct).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update product successfully', (done) => {
      const updateData = { name: 'Updated Product' };
      const updatedProduct = { ...mockProduct, ...updateData };
      const mockResponse = { data: updatedProduct };

      repository.update('test-id', updateData).subscribe((product) => {
        expect(product).toEqual(updatedProduct);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/test-id`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });

    it('should handle update error', (done) => {
      const updateData = { name: 'Updated Product' };

      repository.update('test-id', updateData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/test-id`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete product successfully', (done) => {
      repository.delete('test-id').subscribe((result) => {
        expect(result).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/test-id`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', (done) => {
      repository.delete('test-id').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/test-id`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('exists', () => {
    it('should return true when product exists', (done) => {
      const mockResponse = { data: true };

      repository.exists('test-id').subscribe((exists) => {
        expect(exists).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/verification/test-id`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return false when product does not exist', (done) => {
      const mockResponse = { data: false };

      repository.exists('non-existent').subscribe((exists) => {
        expect(exists).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/verification/non-existent`);
      req.flush(mockResponse);
    });

    it('should return false when API returns no data', (done) => {
      const mockResponse = {};

      repository.exists('test-id').subscribe((exists) => {
        expect(exists).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/verification/test-id`);
      req.flush(mockResponse);
    });

    it('should handle verification error', (done) => {
      repository.exists('test-id').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${mockApiConfig.baseUrl}/products/verification/test-id`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
