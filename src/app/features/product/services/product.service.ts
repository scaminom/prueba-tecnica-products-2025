import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateProductRequestBody,
  UpdateProductRequestBody,
  DeleteProductParams,
  VerifyProductParams,
  GetProductsResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  VerifyProductResponse,
  IProductService,
} from '../interfaces';
import { PRODUCT_REPOSITORY } from '../../../core/tokens/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements IProductService {
  private repository = inject(PRODUCT_REPOSITORY);

  getProducts(): Observable<GetProductsResponse> {
    return this.repository.findAll().pipe(map((products) => ({ data: products })));
  }

  createProduct(product: CreateProductRequestBody): Observable<CreateProductResponse> {
    return this.repository.save(product).pipe(map((savedProduct) => ({ data: savedProduct })));
  }

  updateProduct(id: string, product: UpdateProductRequestBody): Observable<UpdateProductResponse> {
    return this.repository
      .update(id, product)
      .pipe(map((updatedProduct) => ({ data: updatedProduct })));
  }

  deleteProduct(deleteProductParams: DeleteProductParams): Observable<DeleteProductResponse> {
    return this.repository.delete(deleteProductParams.id).pipe(map(() => ({})));
  }

  verifyProductId(verifyProductParams: VerifyProductParams): Observable<VerifyProductResponse> {
    return this.repository.exists(verifyProductParams.id).pipe(map((exists) => ({ data: exists })));
  }
}
