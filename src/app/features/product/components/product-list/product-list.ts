import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';
import { Product } from '../../../../shared/models/product';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ModalComponent, HeaderComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  productStore = inject(ProductStore);
  productListStore = inject(ProductListStore);

  loading = this.productStore.loading;
  error = this.productStore.error;
  hasError = this.productStore.hasError;
  isEmpty = this.productStore.isEmpty;

  products = this.productListStore.paginatedProducts;
  productsCount = this.productListStore.filteredCount;
  searchTerm = this.productListStore.searchTerm;
  pageSize = this.productListStore.pageSize;

  openDropdownId: string | null = null;
  showDeleteModal = signal(false);
  productToDelete: Product | null = null;

  ngOnInit(): void {
    this.productStore.loadProducts();
  }

  onSearch(term: string): void {
    this.productListStore.updateSearchTerm(term);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.productListStore.updatePageSize(Number(target.value));
  }

  onEditProduct(product: Product): void {
    this.productStore.selectProduct(product);
    this.closeDropdown();
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal.set(true);
    this.closeDropdown();
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;

    this.productStore.deleteProduct(this.productToDelete.id);
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productToDelete = null;
  }

  toggleDropdown(productId: string): void {
    this.openDropdownId = this.openDropdownId === productId ? null : productId;
  }

  closeDropdown(): void {
    this.openDropdownId = null;
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
