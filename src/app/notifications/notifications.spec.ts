import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notifications } from './notifications';
import { NotificationService } from '../notification.service';

describe('Notifications', () => {
  let fixture: ComponentFixture<Notifications>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifications],
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);
    service = TestBed.inject(NotificationService);
    await fixture.whenStable();
  });

  it('should show the Enactus applicants notification', () => {
    expect(fixture.nativeElement.textContent).toContain('48 more people applied on the Enactus website.');
    expect(service.unreadCount()).toBe(3);
  });

  it('should open a pop-up and mark the notification as read', () => {
    const firstItem: HTMLButtonElement = fixture.nativeElement.querySelector('li > button');

    firstItem.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    expect(service.unreadCount()).toBe(2);
  });

  it('should filter unread notifications and show an empty state once all are read', () => {
    fixture.componentInstance.filter.set('unread');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li.unread').length).toBe(3);

    service.markAllAsRead();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('You’re all caught up!');
  });
});
