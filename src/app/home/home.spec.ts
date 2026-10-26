import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Home } from './home';
import { CONFERENCES_API, TEST_CONFERENCES } from '../testing/conference-test-data';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
    TestBed.inject(HttpTestingController).expectOne(CONFERENCES_API).flush(TEST_CONFERENCES);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the profile, friends, and notifications sections', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('#profile')).toBeTruthy();
    expect(page.querySelector('#friends')).toBeTruthy();
    expect(page.querySelector('#notifications')).toBeTruthy();
    expect(page.querySelector('#conferences')).toBeTruthy();
  });

  it('should display the conference details section', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.textContent).toContain('Conference details');
    expect(page.querySelector('app-details-conference')).toBeTruthy();
    expect(page.querySelector('app-liste-conference')).toBeTruthy();
  });

  it('should pass a selected conference from the list to the details component', () => {
    const page: HTMLElement = fixture.nativeElement;
    const selectButton = Array.from(page.querySelectorAll<HTMLButtonElement>('button.details-button')).find((button) =>
      button.textContent?.includes('View details'),
    );

    expect(selectButton).toBeDefined();
    expect(page.textContent).toContain('Edit the title or register');

    expect(page.querySelector('[role="dialog"]')).toBeNull();

    selectButton?.click();
    fixture.detectChanges();

    const dialog = page.querySelector<HTMLElement>('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.textContent).toContain('Conference selected from the list.');
    expect(dialog?.textContent).toContain('Angular and Reactive Applications');
    expect(dialog?.textContent).toContain('Participants');
    expect(dialog?.textContent).not.toContain('Edit the conference title');

    const secondSelectButton = Array.from(
      page.querySelectorAll<HTMLButtonElement>('button.details-button'),
    ).find(
      (button) =>
        button.textContent?.includes('View details') &&
        button
          .closest('article')
          ?.textContent?.includes('DESIGNING ACCESSIBLE INTERFACES'),
    );

    secondSelectButton?.click();
    fixture.detectChanges();

    const updatedDialog = page.querySelector<HTMLElement>('[role="dialog"]');
    expect(updatedDialog?.textContent).toContain('Designing Accessible Interfaces');
    expect(updatedDialog?.textContent).toContain('Sousse');
  });
});
