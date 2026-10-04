import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Modal } from '../modal/modal';
import { AppNotification, NotificationService } from '../notification.service';

@Component({
  selector: 'app-notifications',
  imports: [Modal],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications {
  protected readonly service = inject(NotificationService);

  readonly filter = signal<'all' | 'unread'>('all');
  readonly opened = signal<AppNotification | null>(null);

  readonly visible = computed(() =>
    this.filter() === 'unread'
      ? this.service.notifications().filter((n) => n.unread)
      : this.service.notifications(),
  );

  open(notification: AppNotification): void {
    this.opened.set(notification);
    this.service.markAsRead(notification.id);
  }
}
