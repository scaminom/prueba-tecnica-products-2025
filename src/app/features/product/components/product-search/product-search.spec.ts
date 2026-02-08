import { TestBed } from '@angular/core/testing';
import { ProductSearchComponent } from './product-search';

describe('ProductSearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductSearchComponent);
    fixture.componentRef.setInput('searchTerm', '');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit searchChange on input', () => {
    const fixture = TestBed.createComponent(ProductSearchComponent);
    fixture.componentRef.setInput('searchTerm', '');
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    spyOn(comp.searchChange, 'emit');
    const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    expect(comp.searchChange.emit).toHaveBeenCalledWith('test');
  });

  it('should emit addProduct on button click', () => {
    const fixture = TestBed.createComponent(ProductSearchComponent);
    fixture.componentRef.setInput('searchTerm', '');
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    spyOn(comp.addProduct, 'emit');
    const btn = fixture.nativeElement.querySelector('.btn-add') as HTMLButtonElement;
    btn.click();
    expect(comp.addProduct.emit).toHaveBeenCalled();
  });
});
