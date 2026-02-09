import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import type { Toast } from '../../interfaces/toast.interface';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  private readonly notification = inject(NotificationService);

  readonly toasts = this.notification.toasts;

  getTypeClass(toast: Toast): string {
    return `toast--${toast.type}`;
  }

  dismiss(id: number): void {
    this.notification.dismiss(id);
  }
}
