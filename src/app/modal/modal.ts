import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class Modal {
  readonly label = input.required<string>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');
  private readonly previousFocus = inject(ElementRef).nativeElement.ownerDocument
    .activeElement as HTMLElement | null;

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.focus());
  }

  close(): void {
    this.closed.emit();
    this.previousFocus?.focus?.();
  }
}
