import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.html',
  styleUrl: './product-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchComponent {
  searchTerm = input<string>('');

  searchChange = output<string>();
  addProduct = output<void>();

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onAdd(): void {
    this.addProduct.emit();
  }
}
