import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductStore } from './product.store';
import { Product } from '../../../shared/models/product';
import { ProductListState } from './interfaces/product-list-state.interface';

const initialUiState: ProductListState = {
  searchTerm: '',
  pageSize: 5,
};

export const ProductListStore = signalStore(
  { providedIn: 'root' },
  withState(initialUiState),

  withComputed((store) => {
    const productStore = inject(ProductStore);

    return {
      filteredProducts: computed(() => {
        const products = productStore.products();
        const search = store.searchTerm().toLowerCase().trim();
        if (!search) return products;
        return products.filter((p) =>
          [p.id, p.name, p.description].some((f) => f.toLowerCase().includes(search))
        );
      }),
    };
  }),

  withComputed((store) => ({
    paginatedProducts: computed(() => store.filteredProducts().slice(0, store.pageSize())),
  })),

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
