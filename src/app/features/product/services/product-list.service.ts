import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { IProductListService } from '../interfaces/product-list-service.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductListService implements IProductListService {
  filterProducts(products: Product[], searchTerm: string): Product[] {
    if (!searchTerm?.trim()) {
      return products;
    }

    const search = searchTerm.toLowerCase().trim();
    return products.filter((product) =>
      [product.id, product.name, product.description].some((field) =>
        field.toLowerCase().includes(search)
      )
    );
  }

  paginateProducts(products: Product[], pageSize: number): Product[] {
    return products.slice(0, pageSize);
  }

  sortProducts(products: Product[], sortBy: keyof Product, direction: 'asc' | 'desc'): Product[] {
    return [...products].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
