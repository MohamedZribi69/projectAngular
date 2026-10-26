import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ListeConference } from './liste-conference';
import { CONFERENCES_API, TEST_CONFERENCES } from '../testing/conference-test-data';

describe('ListeConference', () => {
  let component: ListeConference;
  let fixture: ComponentFixture<ListeConference>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeConference],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeConference);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    http.expectOne(CONFERENCES_API).flush(TEST_CONFERENCES);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should load the conferences from the service', () => {
    expect(component.error()).toBe(false);
    expect(component.conferences().length).toBe(4);
  });

  it('should show only upcoming conferences with formatted values', () => {
    const page: HTMLElement = fixture.nativeElement;
    const text = page.textContent ?? '';

    expect(text).toContain('ANGULAR AND REACTIVE APPLICATIONS');
    expect(text).toContain('Nov 12, 2026');
    expect(text).not.toContain('PAST CONFERENCE');
  });

  it('should emit the selected conference for the parent component', () => {
    const conference = component.upcomingConferences()[0];
    let selectedConference: typeof conference | undefined;

    component.conferenceSelected.subscribe((selected) => {
      selectedConference = selected;
    });
    component.selectConference(conference);

    expect(selectedConference).toEqual(conference);
  });

  it('should register through updateConference and refresh the seat count', () => {
    const conference = component.upcomingConferences()[0];
    const seatsBefore = component.remainingSeats(conference);

    component.register(conference);

    const request = http.expectOne(`${CONFERENCES_API}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.nbParticipants).toBe(conference.nbParticipants + 1);
    request.flush(request.request.body);

    const updated = component.upcomingConferences().find((item) => item.id === 1);
    expect(updated?.nbParticipants).toBe(conference.nbParticipants + 1);
    expect(updated && component.remainingSeats(updated)).toBe(seatsBefore - 1);
  });

  it('should save an edited conference with updateConference', () => {
    const conference = component.upcomingConferences()[0];
    component.openEdit(conference);

    component.save('Angular Signals Deep Dive', conference.description, conference.date, conference.place, 120);

    const request = http.expectOne(`${CONFERENCES_API}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.title).toBe('Angular Signals Deep Dive');
    request.flush(request.request.body);

    expect(component.form()).toBeNull();
    expect(component.conferences()[0].title).toBe('Angular Signals Deep Dive');
  });

  it('should create a conference with addConference', () => {
    component.openAdd();
    expect(component.form()?.id).toBeUndefined();
    expect(component.form()?.nbParticipants).toBe(0);

    component.save('Enactus Innovation Day', 'Pitch night', '2026-12-20', 'Monastir', 60);

    const request = http.expectOne(CONFERENCES_API);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.title).toBe('Enactus Innovation Day');
    request.flush({ ...request.request.body, id: 5 });

    expect(component.form()).toBeNull();
    expect(component.conferences().find((item) => item.id === 5)?.place).toBe('Monastir');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ENACTUS INNOVATION DAY');
  });

  it('should remove a conference with deleteConference after confirmation', () => {
    component.toDelete.set(component.upcomingConferences()[1]);
    component.delete();

    const request = http.expectOne(`${CONFERENCES_API}/2`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});

    expect(component.toDelete()).toBeNull();
    expect(component.conferences().some((item) => item.id === 2)).toBe(false);
  });

  it('should apply the availability color and disable full conferences', () => {
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.registration-button');

    expect(buttons[0].classList.contains('seats-green')).toBe(true);
    expect(buttons[1].classList.contains('seats-orange')).toBe(true);
    expect(buttons[2].classList.contains('seats-red')).toBe(true);
    expect(buttons[2].disabled).toBe(true);
    expect(buttons[2].textContent).toContain('Sold out');
  });

  it('should show an empty-state message when there are no upcoming conferences', () => {
    component.conferences.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No upcoming conferences for now.',
    );
  });

  it('should show an error message when the API is unreachable', () => {
    component.load();
    http.expectOne(CONFERENCES_API).error(new ProgressEvent('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Could not reach the conference API');
  });
});
