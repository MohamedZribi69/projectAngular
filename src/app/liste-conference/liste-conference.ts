import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import type { ConferenceListing } from '../conference';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-liste-conference',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './liste-conference.html',
  styleUrl: './liste-conference.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeConference {
  private readonly toastService = inject(ToastService);
  readonly conferenceSelected = output<ConferenceListing>();
  readonly conferences = signal<ConferenceListing[]>([
    {
      title: 'Angular and Reactive Applications',
      description: 'Discover Signals and the latest features of the Angular framework.',
      date: '2026-11-12',
      place: 'Tunis',
      maxParticipants: 120,
      nbParticipants: 46,
    },
    {
      title: 'Designing Accessible Interfaces',
      description: 'Best practices for building inclusive interfaces.',
      date: '2026-12-03',
      place: 'Sousse',
      maxParticipants: 80,
      nbParticipants: 73,
    },
    {
      title: 'Web Developers Meetup',
      description: 'A full day of talks about web technologies.',
      date: '2027-01-22',
      place: 'Sfax',
      maxParticipants: 50,
      nbParticipants: 50,
    },
    {
      title: 'Past conference',
      description: 'This past conference should not be displayed.',
      date: '2025-05-10',
      place: 'Tunis',
      maxParticipants: 60,
      nbParticipants: 32,
    },
  ]);

  readonly upcomingConferences = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.conferences().filter(
      (conference) => new Date(`${conference.date}T00:00:00`) >= today,
    );
  });

  remainingSeats(conference: ConferenceListing): number {
    return Math.max(0, conference.maxParticipants - conference.nbParticipants);
  }

  selectConference(conference: ConferenceListing): void {
    this.conferenceSelected.emit(conference);
  }

  register(conference: ConferenceListing): void {
    if (this.remainingSeats(conference) === 0) {
      return;
    }

    this.conferences.update((conferences) =>
      conferences.map((item) =>
        item === conference ? { ...item, nbParticipants: item.nbParticipants + 1 } : item,
      ),
    );
    this.toastService.show('You’re registered!', `See you at “${conference.title}”.`, '🎟️');
  }
}
