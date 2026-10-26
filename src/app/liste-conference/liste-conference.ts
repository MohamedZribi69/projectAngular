import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import type { ConferenceListing } from '../conference';
import { ConferenceService } from '../conference.service';
import { Modal } from '../modal/modal';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-liste-conference',
  imports: [DatePipe, UpperCasePipe, Modal],
  templateUrl: './liste-conference.html',
  styleUrl: './liste-conference.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeConference {
  private readonly service = inject(ConferenceService);
  private readonly toast = inject(ToastService);

  readonly conferenceSelected = output<ConferenceListing>();

  // State
  readonly conferences = signal<ConferenceListing[]>([]); // all conferences from the API
  readonly error = signal(false); // true when the API cannot be reached
  readonly form = signal<ConferenceListing | null>(null); // conference shown in the add/edit pop-up
  readonly toDelete = signal<ConferenceListing | null>(null); // conference waiting for delete confirmation

  // Only the conferences from today on
  readonly upcomingConferences = computed(() => {
    const today = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD", local time
    return this.conferences().filter((c) => c.date >= today);
  });

  constructor() {
    this.load();
  }

  // GET — read every conference
  load(): void {
    this.error.set(false);
    this.service.getConferences().subscribe({
      next: (data) => this.conferences.set(data),
      error: () => this.error.set(true),
    });
  }

  remainingSeats(c: ConferenceListing): number {
    return Math.max(0, c.maxParticipants - c.nbParticipants);
  }

  selectConference(c: ConferenceListing): void {
    this.conferenceSelected.emit(c);
  }

  // UPDATE — register = one more participant
  register(c: ConferenceListing): void {
    if (this.remainingSeats(c) === 0) return;

    this.service.updateConference(c.id!, { ...c, nbParticipants: c.nbParticipants + 1 }).subscribe((saved) => {
      this.conferences.update((list) => list.map((item) => (item.id === saved.id ? saved : item)));
      this.toast.show('You’re registered!', saved.title, '🎟️');
    });
  }

  // Open the pop-up empty (add) or filled (edit)
  openAdd(): void {
    this.form.set({ title: '', description: '', date: '', place: '', maxParticipants: 50, nbParticipants: 0 });
  }

  openEdit(c: ConferenceListing): void {
    this.form.set(c);
  }

  // ADD or UPDATE — called with the values typed in the form
  save(title: string, description: string, date: string, place: string, maxParticipants: number): void {
    const conference = { ...this.form()!, title, description, date, place, maxParticipants };

    if (conference.id === undefined) {
      // ADD
      this.service.addConference(conference).subscribe((created) => {
        this.conferences.update((list) => [...list, created]);
        this.form.set(null);
        this.toast.show('Conference added', created.title, '🎉');
      });
    } else {
      // UPDATE
      this.service.updateConference(conference.id, conference).subscribe((saved) => {
        this.conferences.update((list) => list.map((item) => (item.id === saved.id ? saved : item)));
        this.form.set(null);
        this.toast.show('Conference updated', saved.title, '✏️');
      });
    }
  }

  // DELETE — called from the confirmation pop-up
  delete(): void {
    const c = this.toDelete()!;

    this.service.deleteConference(c.id!).subscribe(() => {
      this.conferences.update((list) => list.filter((item) => item.id !== c.id));
      this.toDelete.set(null);
      this.toast.show('Conference deleted', c.title, '🗑️');
    });
  }
}
