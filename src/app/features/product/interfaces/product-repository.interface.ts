import { Observable } from 'rxjs';
import { Product } from '../../../shared/models/product';

export interface IProductRepository {
  findAll(): Observable<Product[]>;
  findById(id: string): Observable<Product | null>;
  save(product: Product): Observable<Product>;
  update(id: string, product: Partial<Product>): Observable<Product>;
  delete(id: string): Observable<void>;
  exists(id: string): Observable<boolean>;
}

export interface IProductQueryRepository {
  findAll(): Observable<Product[]>;
  findById(id: string): Observable<Product | null>;
  exists(id: string): Observable<boolean>;
}

export interface IProductCommandRepository {
  save(product: Product): Observable<Product>;
  update(id: string, product: Partial<Product>): Observable<Product>;
  delete(id: string): Observable<void>;
}
