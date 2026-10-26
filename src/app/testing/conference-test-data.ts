import type { ConferenceListing } from '../conference';

export const CONFERENCES_API = 'http://localhost:3001/conferences';

/** Same data as db.json, used to answer the mocked HTTP requests in tests. */
export const TEST_CONFERENCES: ConferenceListing[] = [
  {
    id: 1,
    title: 'Angular and Reactive Applications',
    description: 'Discover Signals and the latest features of the Angular framework.',
    date: '2026-11-12',
    place: 'Tunis',
    maxParticipants: 120,
    nbParticipants: 46,
  },
  {
    id: 2,
    title: 'Designing Accessible Interfaces',
    description: 'Best practices for building inclusive interfaces.',
    date: '2026-12-03',
    place: 'Sousse',
    maxParticipants: 80,
    nbParticipants: 73,
  },
  {
    id: 3,
    title: 'Web Developers Meetup',
    description: 'A full day of talks about web technologies.',
    date: '2027-01-22',
    place: 'Sfax',
    maxParticipants: 50,
    nbParticipants: 50,
  },
  {
    id: 4,
    title: 'Past conference',
    description: 'This past conference should not be displayed.',
    date: '2025-05-10',
    place: 'Tunis',
    maxParticipants: 60,
    nbParticipants: 32,
  },
];
