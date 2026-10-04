import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import type { ConferenceListing } from '../conference';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-details-conference',
  imports: [DatePipe],
  templateUrl: './details-conference.html',
  styleUrl: './details-conference.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsConference {
  private readonly toastService = inject(ToastService);
  readonly conf = input<ConferenceListing | null>(null);
  readonly title = signal('Angular and Reactive Applications');
  readonly speaker = signal('Seif Ben Salem');
  readonly eventDate = signal('2026-11-12');
  readonly availableSeats = signal(18);
  readonly registrationMessage = signal('');

  updateTitle(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.title.set(event.target.value);
    }
  }

  register(): void {
    const seats = this.availableSeats();

    if (seats === 0) {
      return;
    }

    this.availableSeats.set(seats - 1);
    this.registrationMessage.set('Your registration has been confirmed.');
    this.toastService.show('Registration confirmed', this.title(), '🎟️');
  }
}
