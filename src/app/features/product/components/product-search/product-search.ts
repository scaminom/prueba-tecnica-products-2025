import { Component, inject, output } from '@angular/core';
import { ProductListStore } from '../../store/product-list.store';

@Component({
  selector: 'app-product-search',
  imports: [],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearchComponent {

  private productListStore = inject(ProductListStore);

  onAddProduct = output<void>();

  searchTerm = this.productListStore.searchTerm;

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.productListStore.updateSearchTerm(target.value);
  }

  onAdd(): void {
    this.onAddProduct.emit();
  }
}
