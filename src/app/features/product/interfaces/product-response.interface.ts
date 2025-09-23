import { Product } from '../../../shared/models/product';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';

export type GetProductsResponse = ApiResponse<Product[]>;

export type CreateProductResponse = ApiResponse<Product>;

export type UpdateProductResponse = ApiResponse<Product>;

export type DeleteProductResponse = ApiResponse<void>;

export type VerifyProductResponse = boolean;
