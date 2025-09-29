import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { switchMap, of, forkJoin } from 'rxjs';
export type ReminderFrequency = 'once' | 'daily';

export interface MedicineReminder {
  id: string; // unique id for editing/removing
  enabled: boolean;
  time: string; // 'HH:mm' format
  frequency: ReminderFrequency;
  date?: string; // 'YYYY-MM-DD' for one-time reminders
}

export interface MedicineCandidate {
  name: string;
  url: string;
  summary?: string;
  imageUrl?: string;
  reminders?: MedicineReminder[];
  // UI state (not persisted)
  _showReminderForm?: boolean;
  _editingReminderId?: string | null;
  _reminderForm?: any;
}

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private readonly http = inject(HttpClient);

  searchMedicine(name: string): Observable<MedicineCandidate[]> {
  const searchUrl = `https://pl.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;

  return this.http.get<any>(searchUrl).pipe(
    switchMap(res => {
      const pages: { title: string; pageid: number; snippet: string }[] = res?.query?.search ?? [];

      if (pages.length === 0) return of([]); 

      // kazdy request potrzebuje dodatkowej informacji o tym czy wyszukiwanie na pewno znalazlo lek
      // 'atc' w 'categories' w api wikipedii oznacza rodzaj leku
      const detailObservables = pages.map(p => this.getMedicineDetails(p.title));

 
      return forkJoin(detailObservables).pipe(
        map(results => {
          return results.filter((r): r is MedicineCandidate => r !== null);
        })
      );
    })
  );
}

 getMedicineDetails(title: string): Observable<MedicineCandidate | null> {
  const metadataUrl = `https://pl.wikipedia.org/w/api.php?action=query&prop=categories&titles=${title}&format=json&origin=*`;
  const summaryUrl = `https://pl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  return this.http.get<any>(metadataUrl).pipe(
    map(res => {
      const pages = res.query?.pages;
      const page = pages ? (Object.values(pages)[0] as { categories?: { title: string }[] }) : null;

      if (!page?.categories) return null;

      // sprawdzamy, czy którakolwiek kategoria zawiera "atc"
      const hasAtc = page.categories.some(cat => cat.title.toLowerCase().includes("atc"));
      if (!hasAtc) return null;

      return page;
    }),
    // jeśli mamy stronę z "atc", pobieramy summary
    switchMap(pageOrNull => {
      if (!pageOrNull) return of(null);

      return this.http.get<any>(summaryUrl).pipe(
        map(res => ({
          name: res.title,
          url: res.content_urls?.desktop?.page ?? res.content_urls?.mobile?.page ?? `https://pl.wikipedia.org/wiki/${encodeURIComponent(res.title)}`,
          summary: res.extract,
          imageUrl: res.thumbnail?.source ?? res.originalimage?.source
        } as MedicineCandidate))
      );
    })
  );
}
}


