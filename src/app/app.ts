import { Component, afterNextRender, inject } from '@angular/core';
import { Header } from './header/header';
import { Home } from './home/home';
import { Footer } from './footer/footer';
import { Toasts } from './toasts/toasts';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  imports: [Header, Home, Footer, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor() {
    const toastService = inject(ToastService);

    // Welcome pop-up shortly after the page appears.
    afterNextRender(() => {
      setTimeout(
        () =>
          toastService.show(
            '48 new applicants 🎉',
            '48 more people applied on the Enactus website.',
            '🚀',
            7000,
          ),
        1200,
      );
    });
  }
}
