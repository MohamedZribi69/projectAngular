import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  icon: string;
  title: string;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(title: string, message: string, icon = '✨', duration = 5000): void {
    const toast: Toast = { id: this.nextId++, icon, title, message, duration };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }
}
