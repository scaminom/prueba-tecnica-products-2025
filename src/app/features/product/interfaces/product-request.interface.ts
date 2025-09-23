import { Product } from '../../../shared/models/product';

export interface CreateProductRequest {
  body: Product;
}

export interface UpdateProductRequest {
  params: {
    id: string;
  };
  body: Omit<Product, 'id'>;
}

export interface DeleteProductRequest {
  params: {
    id: string;
  };
}

export interface VerifyProductRequest {
  params: {
    id: string;
  };
}

export type CreateProductRequestBody = Product;
export type UpdateProductRequestBody = Omit<Product, 'id'>;
export type DeleteProductParams = { id: string };
export type VerifyProductParams = { id: string };
