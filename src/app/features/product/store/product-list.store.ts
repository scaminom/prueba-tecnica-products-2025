import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { ProductStore } from './product.store';
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

    const filteredProducts = computed(() =>
      productListService.filterProducts(productStore.products(), store.searchTerm())
    );

    return {
      filteredProducts,
      paginatedProducts: computed(() =>
        productListService.paginateProducts(filteredProducts(), store.pageSize())
      ),
      filteredCount: computed(() => filteredProducts().length),
    };
  }),

  withMethods((store) => ({
    updateSearchTerm: (searchTerm: string) => patchState(store, { searchTerm }),
    updatePageSize: (pageSize: number) => patchState(store, { pageSize }),
  }))
);
