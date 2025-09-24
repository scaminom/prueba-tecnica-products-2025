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
} from './index';

export interface IProductService {
  getProducts(): Observable<GetProductsResponse>;
  createProduct(product: CreateProductRequestBody): Observable<CreateProductResponse>;
  updateProduct(id: string, product: UpdateProductRequestBody): Observable<UpdateProductResponse>;
  deleteProduct(params: DeleteProductParams): Observable<DeleteProductResponse>;
  verifyProductId(params: VerifyProductParams): Observable<VerifyProductResponse>;
}

export interface IProductReader {
  getProducts(): Observable<GetProductsResponse>;
  verifyProductId(params: VerifyProductParams): Observable<VerifyProductResponse>;
}

export interface IProductWriter {
  createProduct(product: CreateProductRequestBody): Observable<CreateProductResponse>;
  updateProduct(id: string, product: UpdateProductRequestBody): Observable<UpdateProductResponse>;
  deleteProduct(params: DeleteProductParams): Observable<DeleteProductResponse>;
}
