import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSearchComponent } from '../../components/product-search/product-search';
import { ProductTableComponent } from '../../components/product-table/product-table';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';
import { Product } from '../../../../shared/models/product';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductSearchComponent, ProductTableComponent, HeaderComponent, ModalComponent],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
})
export class ProductListPageComponent implements OnInit {
  private productStore = inject(ProductStore);
  private productListStore = inject(ProductListStore);
  private router = inject(Router);

  showDeleteModal = signal<boolean>(false);
  productToDelete = signal<Product | null>(null);

  ngOnInit(): void {
    this.productStore.loadProducts();
  }

  onAddProduct(): void {
    this.router.navigate(['/products/create']);
  }

  onEditProduct(product: Product): void {
    this.productStore.selectProduct(product);
    this.router.navigate(['/products/edit', product.id]);
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  onPageSizeChange(pageSize: number): void {
    this.productListStore.updatePageSize(pageSize);
  }

  confirmDelete(): void {
    if (!this.productToDelete()) return;

    this.productStore.deleteProduct(this.productToDelete()!.id);
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }
}
