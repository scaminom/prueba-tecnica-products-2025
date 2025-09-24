import { Product } from '../../../shared/models/product';

export interface IProductListService {
  filterProducts(products: Product[], searchTerm: string): Product[];
  paginateProducts(products: Product[], pageSize: number): Product[];
  sortProducts(products: Product[], sortBy: keyof Product, direction: 'asc' | 'desc'): Product[];
}

export interface IProductFilter {
  filterProducts(products: Product[], searchTerm: string): Product[];
}

export interface IProductPaginator {
  paginateProducts(products: Product[], pageSize: number): Product[];
}
