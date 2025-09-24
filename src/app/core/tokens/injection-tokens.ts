import { InjectionToken } from '@angular/core';
import {
  IProductService,
  IProductRepository,
  IProductListService,
} from '../../features/product/interfaces';

export const PRODUCT_SERVICE = new InjectionToken<IProductService>('Token for product service');

export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>(
  'Token for product repository'
);

export const PRODUCT_LIST_SERVICE = new InjectionToken<IProductListService>(
  'Token for product list service'
);

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API configuration');
