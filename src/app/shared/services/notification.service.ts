import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  success(message: string): void {
    this.addToast(message, 'success');
  }

  error(message: string): void {
    this.addToast(message, 'error');
  }

  info(message: string): void {
    this.addToast(message, 'info');
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private addToast(message: string, type: ToastType): void {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
