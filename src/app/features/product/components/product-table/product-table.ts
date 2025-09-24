import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';
import { Product } from '../../../../shared/models/product';

@Component({
  selector: 'app-product-table',
  imports: [CommonModule],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTableComponent {
  private productStore = inject(ProductStore);
  private productListStore = inject(ProductListStore);

  onEditProduct = output<Product>();
  onDeleteProduct = output<Product>();
  onPageSizeChange = output<number>();

  loading = this.productStore.loading;
  error = this.productStore.error;
  isEmpty = this.productStore.isEmpty;
  products = this.productListStore.paginatedProducts;
  productsCount = this.productListStore.filteredCount;
  pageSize = this.productListStore.pageSize;

  openDropdownId: string | null = null;

  toggleDropdown(productId: string): void {
    this.openDropdownId = this.openDropdownId === productId ? null : productId;
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  onEdit(product: Product): void {
    this.onEditProduct.emit(product);
    this.closeDropdown();
  }

  onDelete(product: Product): void {
    this.onDeleteProduct.emit(product);
    this.closeDropdown();
  }

  onPageSizeChanged(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onPageSizeChange.emit(Number(target.value));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  clearError(): void {
    this.productStore.clearError();
    this.productStore.loadProducts();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'default-logo.svg';
  }
}
