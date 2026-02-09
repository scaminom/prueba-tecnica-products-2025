import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipComponent],
})
export class ProductTableComponent {
  products = input.required<Product[]>();
  loading = input.required<boolean>();
  error = input.required<string | null>();
  isEmpty = input.required<boolean>();
  productsCount = input.required<number>();
  pageSize = input.required<number>();

  editProduct = output<Product>();
  deleteProduct = output<Product>();
  pageSizeChange = output<number>();
  retryLoad = output<void>();

  openDropdownId = signal<string | null>(null);

  toggleDropdown(productId: string): void {
    this.openDropdownId.update((current) => (current === productId ? null : productId));
  }

  closeDropdown(): void {
    this.openDropdownId.set(null);
  }

  onEdit(product: Product): void {
    this.editProduct.emit(product);
    this.closeDropdown();
  }

  onDelete(product: Product): void {
    this.deleteProduct.emit(product);
    this.closeDropdown();
  }

  onPageSizeChanged(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(target.value));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'default-logo.svg';
  }
}
