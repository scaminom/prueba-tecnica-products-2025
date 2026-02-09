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
} from './index';

export interface IProductService {
  getProducts(): Observable<GetProductsResponse>;
  createProduct(product: CreateProductRequestBody): Observable<CreateProductResponse>;
  updateProduct(id: string, product: UpdateProductRequestBody): Observable<UpdateProductResponse>;
  deleteProduct(params: DeleteProductParams): Observable<DeleteProductResponse>;
  verifyProductId(params: VerifyProductParams): Observable<boolean>;
}

export interface IProductReader {
  getProducts(): Observable<GetProductsResponse>;
  verifyProductId(params: VerifyProductParams): Observable<boolean>;
}

export interface IProductWriter {
  createProduct(product: CreateProductRequestBody): Observable<CreateProductResponse>;
  updateProduct(id: string, product: UpdateProductRequestBody): Observable<UpdateProductResponse>;
  deleteProduct(params: DeleteProductParams): Observable<DeleteProductResponse>;
}
