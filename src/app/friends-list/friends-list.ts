import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Modal } from '../modal/modal';
import { ToastService } from '../toast.service';

interface Friend {
  initials: string;
  name: string;
  role: string;
  status: string;
  online: boolean;
  color: string;
}

@Component({
  selector: 'app-friends-list',
  imports: [Modal],
  templateUrl: './friends-list.html',
  styleUrl: './friends-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendsList {
  private readonly toastService = inject(ToastService);

  readonly friends: Friend[] = [
    {
      initials: 'SB',
      name: 'Seif Ben Salem',
      role: 'Enactus Project Manager',
      status: 'Online',
      online: true,
      color: 'linear-gradient(135deg, #6d28d9, #a855f7)',
    },
    {
      initials: 'DT',
      name: 'Dhia Taamouli',
      role: 'Enactus Marketing Lead',
      status: 'Active 2 h ago',
      online: false,
      color: 'linear-gradient(135deg, #0f766e, #22c55e)',
    },
    {
      initials: 'MC',
      name: 'Mohamed Nazim Chaouch',
      role: 'Enactus Tech Lead',
      status: 'Online',
      online: true,
      color: 'linear-gradient(135deg, #db2777, #f59e0b)',
    },
  ];

  readonly selectedFriend = signal<Friend | null>(null);

  wave(friend: Friend): void {
    this.selectedFriend.set(null);
    this.toastService.show(`You waved at ${friend.name}`, 'They will see it next time they log in.', '👋');
  }
}
