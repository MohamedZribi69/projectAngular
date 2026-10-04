import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Modal } from '../modal/modal';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-user-profile',
  imports: [Modal],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  private readonly toastService = inject(ToastService);

  readonly stats = [
    { label: 'New applicants', value: 48, icon: '🚀' },
    { label: 'Interviews', value: 12, icon: '🗓️' },
    { label: 'Team members', value: 3, icon: '👥' },
    { label: 'Conferences', value: 3, icon: '🎤' },
  ];

  readonly applicantsByTeam = [
    { team: 'Marketing', count: 17 },
    { team: 'Tech', count: 14 },
    { team: 'Projects', count: 11 },
    { team: 'Finance', count: 6 },
  ];

  /** Animation progress (0 → 1) used to count the stats up on first render. */
  readonly progress = signal(0);
  readonly applicantsOpen = signal(false);

  constructor() {
    let frame = 0;
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(frame));

    afterNextRender(() => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        this.progress.set(1 - Math.pow(1 - t, 3));
        if (t < 1) {
          frame = requestAnimationFrame(step);
        }
      };
      frame = requestAnimationFrame(step);
    });
  }

  displayValue(value: number): number {
    return Math.round(value * this.progress());
  }

  startReview(): void {
    this.applicantsOpen.set(false);
    this.toastService.show('Review started', 'The 48 applications were added to your review queue.', '✅');
  }
}
