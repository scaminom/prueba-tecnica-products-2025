import { Injectable, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, catchError, of, map } from 'rxjs';
import { ProductStore } from '../store/product.store';
import { ProductListStore } from '../store/product-list.store';
import { PRODUCT_SERVICE } from '../../../core/tokens/injection-tokens';
import { NotificationService } from '../../../shared/services/notification.service';
import { Product } from '../../../shared/models/product';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly productStore = inject(ProductStore);
  private readonly productListStore = inject(ProductListStore);
  private readonly productService = inject(PRODUCT_SERVICE);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();

  readonly products = this.productListStore.paginatedProducts;
  readonly loading = this.productStore.loading;
  readonly error = this.productStore.error;
  readonly isEmpty = this.productStore.isEmpty;
  readonly searchTerm = this.productListStore.searchTerm;
  readonly pageSize = this.productListStore.pageSize;
  readonly filteredCount = this.productListStore.filteredCount;
  readonly selectedProduct = this.productStore.selectedProduct;

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => this.productListStore.updateSearchTerm(term));
  }

  loadProducts(): void {
    this.productStore.setLoading();
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.productStore.setProducts(response.data ?? []);
        },
        error: () => {
          this.productStore.setError('Error al cargar los productos. Intente nuevamente.');
        },
      });
  }

  createProduct(product: Product): void {
    this.productStore.setLoading();
    this.productService
      .createProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.productStore.addProduct(response.data);
            this.notifications.success('Producto creado exitosamente.');
            this.navigateToList();
          }
        },
        error: () => {
          this.productStore.setError('Error al crear el producto.');
          this.notifications.error('Error al crear el producto.');
        },
      });
  }

  updateProduct(id: string, product: Omit<Product, 'id'>): void {
    this.productStore.setLoading();
    this.productService
      .updateProduct(id, product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.productStore.replaceProduct(id, response.data);
            this.notifications.success('Producto actualizado exitosamente.');
            this.navigateToList();
          }
        },
        error: () => {
          this.productStore.setError('Error al actualizar el producto.');
          this.notifications.error('Error al actualizar el producto.');
        },
      });
  }

  deleteProduct(id: string): void {
    this.productStore.setLoading();
    this.productService
      .deleteProduct({ id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.productStore.removeProduct(id);
          this.notifications.success('Producto eliminado exitosamente.');
        },
        error: () => {
          this.productStore.setError('Error al eliminar el producto.');
          this.notifications.error('Error al eliminar el producto.');
        },
      });
  }

  verifyProductId(id: string) {
    return this.productService.verifyProductId({ id }).pipe(
      map((response) => response.data || false),
      catchError(() => of(false))
    );
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  updatePageSize(size: number): void {
    this.productListStore.updatePageSize(size);
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/create']);
  }

  navigateToEdit(product: Product): void {
    this.productStore.selectProduct(product);
    this.router.navigate(['/products/edit', product.id]);
  }

  navigateToList(): void {
    this.router.navigate(['/products']);
  }

  retryLoad(): void {
    this.productStore.clearError();
    this.loadProducts();
  }
}
