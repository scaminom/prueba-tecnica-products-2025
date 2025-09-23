import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
} from '../interfaces';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productApiUrl = `${environment.apiUrl}/products`;

  private http = inject(HttpClient);

  getProducts(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(this.productApiUrl);
  }

  createProduct(product: CreateProductRequestBody): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(this.productApiUrl, product);
  }

  updateProduct(id: string, product: UpdateProductRequestBody): Observable<UpdateProductResponse> {
    return this.http.put<UpdateProductResponse>(`${this.productApiUrl}/${id}`, product);
  }

  deleteProduct(deleteProductParams: DeleteProductParams): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      `${this.productApiUrl}/${deleteProductParams.id}`
    );
  }

  verifyProductId(verifyProductParams: VerifyProductParams): Observable<VerifyProductResponse> {
    return this.http.get<VerifyProductResponse>(
      `${this.productApiUrl}/verification/${verifyProductParams.id}`
    );
  }
}
