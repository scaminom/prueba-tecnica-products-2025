import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductStore } from './product.store';
import { Product } from '../../../shared/models/product';
import { ProductListState } from './interfaces/product-list-state.interface';
import { PRODUCT_LIST_SERVICE } from '../../../core/tokens/injection-tokens';

const initialUiState: ProductListState = {
  searchTerm: '',
  pageSize: 5,
};

export const ProductListStore = signalStore(
  { providedIn: 'root' },
  withState(initialUiState),

  withComputed((store) => {
    const productStore = inject(ProductStore);
    const productListService = inject(PRODUCT_LIST_SERVICE);

    return {
      filteredProducts: computed(() => {
        const products = productStore.products();
        const searchTerm = store.searchTerm();
        return productListService.filterProducts(products, searchTerm);
      }),
    };
  }),

  withComputed((store) => {
    const productListService = inject(PRODUCT_LIST_SERVICE);

    return {
      paginatedProducts: computed(() => {
        const filteredProducts = store.filteredProducts();
        const pageSize = store.pageSize();
        return productListService.paginateProducts(filteredProducts, pageSize);
      }),
    };
  }),

  withComputed((store) => ({
    tableDataSource: computed(() =>
      store.paginatedProducts().map((product: Product) => ({
        ...product,
      }))
    ),
  })),

  withComputed((store) => ({
    filteredCount: computed(() => store.filteredProducts().length),
  })),

  withMethods((store) => ({
    updateSearchTerm: (searchTerm: string) => patchState(store, { searchTerm }),
    updatePageSize: (pageSize: number) => patchState(store, { pageSize }),
  }))
);
