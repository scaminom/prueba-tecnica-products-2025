import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../../shared/models/product';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { API_CONFIG } from '../../../core/tokens/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class HttpProductRepository implements IProductRepository {
  private http = inject(HttpClient);
  private apiConfig = inject(API_CONFIG);

  private get productApiUrl(): string {
    return `${this.apiConfig.baseUrl}/products`;
  }

  findAll(): Observable<Product[]> {
    return this.http
      .get<{ data?: Product[] }>(`${this.productApiUrl}`)
      .pipe(map((response) => response.data || []));
  }

  findById(id: string): Observable<Product | null> {
    return this.http
      .get<{ data?: Product }>(`${this.productApiUrl}/${id}`)
      .pipe(map((response) => response.data || null));
  }

  save(product: Product): Observable<Product> {
    return this.http
      .post<{ data?: Product }>(`${this.productApiUrl}`, product)
      .pipe(map((response) => response.data!));
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<{ data?: Product }>(`${this.productApiUrl}/${id}`, product)
      .pipe(map((response) => response.data!));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.productApiUrl}/${id}`);
  }

  exists(id: string): Observable<boolean> {
    debugger;
    return this.http
      .get<boolean>(`${this.productApiUrl}/verification/${id}`)
      .pipe(map((response) => response));
  }
}
