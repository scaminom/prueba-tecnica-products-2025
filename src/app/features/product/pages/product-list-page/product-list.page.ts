import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ProductSearchComponent } from '../../components/product-search/product-search';
import { ProductTableComponent } from '../../components/product-table/product-table';
import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../../../shared/models/product';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductSearchComponent, ProductTableComponent, HeaderComponent, ModalComponent],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPageComponent implements OnInit {
  private readonly facade = inject(ProductFacade);

  readonly products = this.facade.products;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly isEmpty = this.facade.isEmpty;
  readonly filteredCount = this.facade.filteredCount;
  readonly pageSize = this.facade.pageSize;
  readonly searchTerm = this.facade.searchTerm;

  showDeleteModal = signal(false);
  productToDelete = signal<Product | null>(null);

  ngOnInit(): void {
    this.facade.loadProducts();
  }

  onAddProduct(): void {
    this.facade.navigateToCreate();
  }

  onSearchChange(term: string): void {
    this.facade.onSearchChange(term);
  }

  onEditProduct(product: Product): void {
    this.facade.navigateToEdit(product);
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  onPageSizeChange(pageSize: number): void {
    this.facade.updatePageSize(pageSize);
  }

  onRetryLoad(): void {
    this.facade.retryLoad();
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.facade.deleteProduct(product.id);
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }
}
