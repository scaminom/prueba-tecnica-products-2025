import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  show = input.required<boolean>();
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
