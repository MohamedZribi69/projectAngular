import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.html',
  styleUrl: './toasts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toasts {
  protected readonly toastService = inject(ToastService);
}
