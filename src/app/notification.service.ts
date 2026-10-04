import { Injectable, computed, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  icon: string;
  title: string;
  message: string;
  details: string;
  time: string;
  unread: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<AppNotification[]>([
    {
      id: 1,
      icon: '🚀',
      title: '48 new Enactus applicants',
      message: '48 more people applied on the Enactus website.',
      details:
        'Recruitment is going strong: 48 new candidates submitted their application on the Enactus website. Review them and shortlist the best profiles for interviews.',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      icon: '🗓️',
      title: 'Interviews to schedule',
      message: '12 candidates are waiting for an interview slot.',
      details:
        '12 shortlisted candidates are waiting for an interview slot this week. Share the calendar with the team so everyone can pick a slot.',
      time: '1 h ago',
      unread: true,
    },
    {
      id: 3,
      icon: '🏆',
      title: 'Enactus National Competition',
      message: 'Project submission closes in 10 days.',
      details:
        'The submission window for the Enactus National Competition closes in 10 days. Finalize the project report and rehearse the team pitch.',
      time: '3 h ago',
      unread: true,
    },
    {
      id: 4,
      icon: '🤝',
      title: 'Weekly board meeting',
      message: 'The Enactus board meets tomorrow at 6 PM.',
      details:
        'Weekly board meeting tomorrow at 6 PM. Agenda: recruitment progress, competition preparation and upcoming events.',
      time: 'Yesterday',
      unread: false,
    },
  ]);

  readonly unreadCount = computed(() => this.notifications().filter((n) => n.unread).length);

  markAsRead(id: number): void {
    this.notifications.update((list) =>
      list.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((list) => list.map((item) => ({ ...item, unread: false })));
  }
}
