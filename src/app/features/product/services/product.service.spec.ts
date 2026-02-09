import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { PRODUCT_REPOSITORY } from '../../../core/tokens/injection-tokens';
import { of, throwError } from 'rxjs';
import { Product } from '../../../shared/models/product';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: jasmine.SpyObj<IProductRepository>;

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
    const repositorySpy = jasmine.createSpyObj('IProductRepository', [
      'findAll',
      'findById',
      'save',
      'update',
      'delete',
      'exists',
    ]);

    TestBed.configureTestingModule({
      providers: [ProductService, { provide: PRODUCT_REPOSITORY, useValue: repositorySpy }],
    });

    service = TestBed.inject(ProductService);
    mockRepository = TestBed.inject(PRODUCT_REPOSITORY) as jasmine.SpyObj<IProductRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products wrapped in response object', (done) => {
      mockRepository.findAll.and.returnValue(of(mockProducts));

      service.getProducts().subscribe((response) => {
        expect(response).toEqual({ data: mockProducts });
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should handle repository error', (done) => {
      const error = new Error('Repository error');
      mockRepository.findAll.and.returnValue(throwError(() => error));

      service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    it('should return empty array when repository returns empty', (done) => {
      mockRepository.findAll.and.returnValue(of([]));

      service.getProducts().subscribe((response) => {
        expect(response).toEqual({ data: [] });
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', (done) => {
      mockRepository.save.and.returnValue(of(mockProduct));

      service.createProduct(mockProduct).subscribe((response) => {
        expect(response).toEqual({ data: mockProduct });
        expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should handle repository error during creation', (done) => {
      const error = new Error('Creation failed');
      mockRepository.save.and.returnValue(throwError(() => error));

      service.createProduct(mockProduct).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
          done();
        },
      });
    });

    it('should pass correct product data to repository', (done) => {
      const newProduct: Product = {
        id: 'new-id',
        name: 'New Product',
        description: 'New Description',
        logo: 'new-logo.png',
        date_release: '2025-03-01',
        date_revision: '2026-03-01',
      };

      mockRepository.save.and.returnValue(of(newProduct));

      service.createProduct(newProduct).subscribe((response) => {
        expect(response.data).toEqual(newProduct);
        expect(mockRepository.save).toHaveBeenCalledWith(newProduct);
        done();
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', (done) => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated-logo.png',
        date_release: '2025-04-01',
        date_revision: '2026-04-01',
      };
      const updatedProduct = { ...mockProduct, ...updateData };

      mockRepository.update.and.returnValue(of(updatedProduct));

      service.updateProduct('test-id', updateData).subscribe((response) => {
        expect(response).toEqual({ data: updatedProduct });
        expect(mockRepository.update).toHaveBeenCalledWith('test-id', updateData);
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should handle repository error during update', (done) => {
      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated-logo.png',
        date_release: '2025-04-01',
        date_revision: '2026-04-01',
      };
      const error = new Error('Update failed');
      mockRepository.update.and.returnValue(throwError(() => error));

      service.updateProduct('test-id', updateData).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          expect(mockRepository.update).toHaveBeenCalledWith('test-id', updateData);
          done();
        },
      });
    });

    it('should handle partial updates', (done) => {
      const updateData = {
        name: 'Only Name Updated',
        description: 'Updated Description',
        logo: 'updated-logo.png',
        date_release: '2025-04-01',
        date_revision: '2026-04-01',
      };
      const updatedProduct = { ...mockProduct, name: 'Only Name Updated' };

      mockRepository.update.and.returnValue(of(updatedProduct));

      service.updateProduct('test-id', updateData).subscribe((response) => {
        expect(response.data?.name).toBe('Only Name Updated');
        expect(response.data?.id).toBe(mockProduct.id);
        expect(mockRepository.update).toHaveBeenCalledWith('test-id', updateData);
        done();
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', (done) => {
      mockRepository.delete.and.returnValue(of(undefined));

      service.deleteProduct({ id: 'test-id' }).subscribe((response) => {
        expect(response).toEqual({});
        expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
        expect(mockRepository.delete).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should handle repository error during deletion', (done) => {
      const error = new Error('Delete failed');
      mockRepository.delete.and.returnValue(throwError(() => error));

      service.deleteProduct({ id: 'test-id' }).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
          done();
        },
      });
    });

    it('should extract id from delete params correctly', (done) => {
      mockRepository.delete.and.returnValue(of(undefined));

      const deleteParams = { id: 'specific-id' };
      service.deleteProduct(deleteParams).subscribe((response) => {
        expect(response).toEqual({});
        expect(mockRepository.delete).toHaveBeenCalledWith('specific-id');
        done();
      });
    });
  });

  describe('verifyProductId', () => {
    it('should return true when product exists', (done) => {
      mockRepository.exists.and.returnValue(of(true));

      service.verifyProductId({ id: 'test-id' }).subscribe((response) => {
        expect(response).toEqual(true);
        expect(mockRepository.exists).toHaveBeenCalledWith('test-id');
        expect(mockRepository.exists).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should return false when product does not exist', (done) => {
      mockRepository.exists.and.returnValue(of(false));

      service.verifyProductId({ id: 'non-existent' }).subscribe((response) => {
        expect(response).toEqual(false);
        expect(mockRepository.exists).toHaveBeenCalledWith('non-existent');
        done();
      });
    });

    it('should handle repository error during verification', (done) => {
      const error = new Error('Verification failed');
      mockRepository.exists.and.returnValue(throwError(() => error));

      service.verifyProductId({ id: 'test-id' }).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          expect(mockRepository.exists).toHaveBeenCalledWith('test-id');
          done();
        },
      });
    });

    it('should extract id from verify params correctly', (done) => {
      mockRepository.exists.and.returnValue(of(true));

      const verifyParams = { id: 'specific-verify-id' };
      service.verifyProductId(verifyParams).subscribe((response) => {
        expect(response).toBe(true);
        expect(mockRepository.exists).toHaveBeenCalledWith('specific-verify-id');
        done();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple operations in sequence', (done) => {
      mockRepository.findAll.and.returnValues(of([]), of([mockProduct]));
      mockRepository.save.and.returnValue(of(mockProduct));

      service.getProducts().subscribe((response1) => {
        expect(response1.data).toEqual([]);

        service.createProduct(mockProduct).subscribe((response2) => {
          expect(response2.data).toEqual(mockProduct);

          service.getProducts().subscribe((response3) => {
            expect(response3.data).toEqual([mockProduct]);
            done();
          });
        });
      });
    });

    it('should maintain data consistency across operations', (done) => {
      const originalProduct = { ...mockProduct };
      const updateData = {
        name: 'Updated Name',
        description: 'Updated Description',
        logo: 'updated-logo.png',
        date_release: '2025-04-01',
        date_revision: '2026-04-01',
      };
      const updatedProduct = { ...originalProduct, ...updateData };

      mockRepository.update.and.returnValue(of(updatedProduct));
      mockRepository.exists.and.returnValue(of(true));

      service.updateProduct(originalProduct.id, updateData).subscribe((updateResponse) => {
        expect(updateResponse.data?.name).toBe('Updated Name');
        expect(updateResponse.data?.id).toBe(originalProduct.id);

        service.verifyProductId({ id: originalProduct.id }).subscribe((verifyResponse) => {
          expect(verifyResponse).toBe(true);
          done();
        });
      });
    });
  });
});
