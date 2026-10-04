import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { Navigation } from '../navigation/navigation';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-header',
  imports: [Navigation],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class Header {
  protected readonly notificationService = inject(NotificationService);
  protected readonly menuOpen = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }
}
