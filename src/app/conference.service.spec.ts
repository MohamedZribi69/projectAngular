import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ConferenceService } from './conference.service';
import type { ConferenceListing } from './conference';

describe('ConferenceService', () => {
  const apiUrl = 'http://localhost:3001/conferences';
  const conference: ConferenceListing = {
    id: 1,
    title: 'Angular and Reactive Applications',
    description: 'Signals',
    date: '2026-11-12',
    place: 'Tunis',
    maxParticipants: 120,
    nbParticipants: 46,
  };

  let service: ConferenceService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConferenceService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should get all conferences', () => {
    let result: ConferenceListing[] = [];
    service.getConferences().subscribe((list) => (result = list));

    const request = http.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush([conference]);

    expect(result).toEqual([conference]);
  });

  it('should get one conference by id', () => {
    service.getConference(1).subscribe();

    expect(http.expectOne(`${apiUrl}/1`).request.method).toBe('GET');
  });

  it('should add a conference', () => {
    const { id, ...newConference } = conference;
    service.addConference(newConference).subscribe();

    const request = http.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newConference);
  });

  it('should update a conference with PUT', () => {
    let saved: ConferenceListing | undefined;
    const changes = { ...conference, title: 'New title' };

    service.updateConference(1, changes).subscribe((value) => (saved = value));

    const request = http.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ ...changes, id: 1 });
    request.flush(changes);

    expect(saved?.title).toBe('New title');
  });

  it('should delete a conference', () => {
    let done = false;
    service.deleteConference(1).subscribe(() => (done = true));

    const request = http.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});

    expect(done).toBe(true);
  });
});
