import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { Product } from '../../../shared/models/product';
import { ProductState } from './interfaces/product-state.interface';

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    hasError: computed(() => !!store.error()),
    isEmpty: computed(() => !store.loading() && !store.error() && store.products().length === 0),
  })),

  withMethods((store) => ({
    setLoading: () => patchState(store, { loading: true, error: null }),
    setError: (message: string) => patchState(store, { error: message, loading: false }),
    clearError: () => patchState(store, { error: null }),
    clearLoading: () => patchState(store, { loading: false }),

    setProducts: (products: Product[]) =>
      patchState(store, { products, loading: false }),

    addProduct: (product: Product) =>
      patchState(store, { products: [...store.products(), product], loading: false }),

    replaceProduct: (id: string, product: Product) =>
      patchState(store, {
        products: store.products().map((p) => (p.id === id ? { ...p, ...product } : p)),
        loading: false,
      }),

    removeProduct: (id: string) =>
      patchState(store, {
        products: store.products().filter((p) => p.id !== id),
        loading: false,
      }),

    selectProduct: (product: Product | null) =>
      patchState(store, { selectedProduct: product }),
  }))
);
