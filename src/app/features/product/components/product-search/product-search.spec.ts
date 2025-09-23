import { TestBed } from '@angular/core/testing';
import { ProductSearchComponent } from './product-search';
import { ProductListStore } from '../../store/product-list.store';

class ProductListStoreStub {
  searchTerm = () => '';
  updateSearchTerm() {}
}

describe('ProductSearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
      providers: [{ provide: ProductListStore, useClass: ProductListStoreStub }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductSearchComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
