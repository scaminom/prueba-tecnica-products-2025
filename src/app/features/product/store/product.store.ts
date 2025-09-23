import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../services/product.service';
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

  withMethods((store) => {
    const productService = inject(ProductService);

    const setLoading = () => patchState(store, { loading: true, error: null });
    const setError = (message: string) => patchState(store, { error: message, loading: false });

    return {
      selectProduct: (product: Product | null) => {
        patchState(store, { selectedProduct: product });
      },

      clearError: () => {
        patchState(store, { error: null });
      },

      loadProducts: rxMethod<void>(
        pipe(
          tap(setLoading),
          switchMap(() =>
            productService.getProducts().pipe(
              tap((response) => {
                if (response.data) {
                  patchState(store, {
                    products: response.data,
                    loading: false,
                  });
                }
              }),
              catchError(() => {
                setError('Error al cargar los productos. Intente nuevamente.');
                return of(null);
              })
            )
          )
        )
      ),

      createProduct: rxMethod<Product>(
        pipe(
          tap(setLoading),
          switchMap((product) =>
            productService.createProduct(product).pipe(
              tap((response) => {
                if (response.data) {
                  patchState(store, {
                    products: [...store.products(), response.data],
                    loading: false,
                  });
                }
              }),
              catchError(() => {
                setError('Error al crear el producto.');
                return of(null);
              })
            )
          )
        )
      ),

      updateProduct: rxMethod<{ id: string; product: Omit<Product, 'id'> }>(
        pipe(
          tap(setLoading),
          switchMap(({ id, product }) =>
            productService.updateProduct(id, product).pipe(
              tap((response) => {
                if (response.data) {
                  patchState(store, {
                    products: store
                      .products()
                      .map((p) => (p.id === id ? { ...p, ...response.data } : p)),
                    loading: false,
                  });
                }
              }),
              catchError(() => {
                setError('Error al actualizar el producto.');
                return of(null);
              })
            )
          )
        )
      ),

      deleteProduct: rxMethod<string>(
        pipe(
          tap(setLoading),
          switchMap((id) =>
            productService.deleteProduct({ id }).pipe(
              tap(() => {
                patchState(store, {
                  products: store.products().filter((p) => p.id !== id),
                  loading: false,
                });
              }),
              catchError(() => {
                setError('Error al eliminar el producto.');
                return of(null);
              })
            )
          )
        )
      ),

      verifyProductId: (id: string) => {
        return productService.verifyProductId({ id }).pipe(
          switchMap((response) => of(!!response)),
          catchError(() => of(false))
        );
      },
    };
  })
);
