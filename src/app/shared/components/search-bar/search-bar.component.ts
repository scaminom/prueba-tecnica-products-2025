import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  placeholder = input<string>('Search...');
  initialValue = input<string>('');
  searchChange = output<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
