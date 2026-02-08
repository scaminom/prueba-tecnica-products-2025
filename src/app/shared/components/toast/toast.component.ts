import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type" (click)="notificationService.dismiss(toast.id)">
          <span class="toast__icon">
            @switch (toast.type) {
              @case ('success') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> }
              @case ('error') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/></svg> }
              @case ('info') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg> }
            }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      border-radius: 0.625rem;
      min-width: 280px;
      max-width: 420px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      pointer-events: auto;
      animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
      border-left: 4px solid;
    }

    .toast--success {
      background: #f0fdf4;
      color: #166534;
      border-left-color: #22c55e;
    }

    .toast--error {
      background: #fef2f2;
      color: #991b1b;
      border-left-color: #ef4444;
    }

    .toast--info {
      background: #eff6ff;
      color: #1e40af;
      border-left-color: #3b82f6;
    }

    .toast__icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .toast__message {
      line-height: 1.4;
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
  `],
})
export class ToastComponent {
  protected readonly notificationService = inject(NotificationService);
}
