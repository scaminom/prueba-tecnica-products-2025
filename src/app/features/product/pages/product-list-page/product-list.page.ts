import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductSearchComponent } from '../../components/product-search/product-search';
import { ProductTableComponent } from '../../components/product-table/product-table';
import { ProductStore } from '../../store/product.store';
import { ProductListStore } from '../../store/product-list.store';
import { Product } from '../../../../shared/models/product';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductSearchComponent, ProductTableComponent],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
})
export class ProductListPageComponent implements OnInit {
  private productStore = inject(ProductStore);
  private productListStore = inject(ProductListStore);
  private router = inject(Router);

  // Modal state
  showDeleteModal = false;
  productToDelete: Product | null = null;

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
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  onPageSizeChange(pageSize: number): void {
    this.productListStore.updatePageSize(pageSize);
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
}
