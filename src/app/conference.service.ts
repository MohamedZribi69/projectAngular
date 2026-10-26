import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { ConferenceListing } from './conference';

@Injectable({ providedIn: 'root' })
export class ConferenceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3001/conferences';

  /** GET /conferences — every conference. */
  getConferences(): Observable<ConferenceListing[]> {
    return this.http.get<ConferenceListing[]>(this.apiUrl);
  }

  /** GET /conferences/:id — a single conference. */
  getConference(id: number): Observable<ConferenceListing> {
    return this.http.get<ConferenceListing>(`${this.apiUrl}/${id}`);
  }

  /** POST /conferences — creates a conference; the API assigns its id. */
  addConference(conference: ConferenceListing): Observable<ConferenceListing> {
    return this.http.post<ConferenceListing>(this.apiUrl, conference);
  }

  /** PUT /conferences/:id — replaces the conference and returns the saved version. */
  updateConference(id: number, conference: ConferenceListing): Observable<ConferenceListing> {
    return this.http.put<ConferenceListing>(`${this.apiUrl}/${id}`, { ...conference, id });
  }

  /** DELETE /conferences/:id — removes the conference. */
  deleteConference(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
