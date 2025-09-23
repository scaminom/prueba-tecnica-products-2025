import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';
import { Product } from '../../../../shared/models/product';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  // Inyección de stores separados
  productStore = inject(ProductStore);
  productListStore = inject(ProductListStore);

  // Signals del store principal (data)
  loading = this.productStore.loading;
  error = this.productStore.error;
  hasError = this.productStore.hasError;
  isEmpty = this.productStore.isEmpty;
  
  // Signals del store de lista (UI state)
  products = this.productListStore.paginatedProducts;
  productsCount = this.productListStore.filteredCount;
  searchTerm = this.productListStore.searchTerm;
  pageSize = this.productListStore.pageSize;

  // Estado local para UI
  openDropdownId: string | null = null;
  showDeleteModal = false;
  productToDelete: Product | null = null;

  ngOnInit(): void {
    this.productStore.loadProducts();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.productListStore.updateSearchTerm(target.value);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.productListStore.updatePageSize(Number(target.value));
  }

  onAddProduct(): void {
    // TODO: Navigate to add product form
    console.log('Navigate to add product');
  }

  onEditProduct(product: Product): void {
    // TODO: Navigate to edit product form
    this.productStore.selectProduct(product);
    console.log('Edit product:', product);
    this.closeDropdown();
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
    this.closeDropdown();
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;

    this.productStore.deleteProduct(this.productToDelete.id);
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
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
      year: 'numeric'
    });
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  clearError(): void {
    this.productStore.clearError();
    this.productStore.loadProducts();
  }
}
