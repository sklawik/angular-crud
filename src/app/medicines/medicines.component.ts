import { Component, inject, AfterViewInit, QueryList, ViewChildren, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MedicineService } from '../services/medicine.service';
import { MedicinesModel } from './medicines.model';
import { MedicinesPresenter } from './medicines.presenter';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  template: `
  <div [class.dark]="darkMode" class="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-white via-emerald-100 to-emerald-300 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-950 transition-colors">
      <div class="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/40 animate-fade-in bg-gradient-to-br from-white via-emerald-50 to-emerald-100 dark:from-black dark:via-gray-900 dark:to-gray-950 dark:bg-opacity-100 transition-colors">
        <div class="flex justify-end mb-2">
          <button (click)="toggleDarkMode()" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-100 to-white dark:from-gray-800 dark:to-black text-emerald-700 dark:text-white border border-emerald-200 dark:border-gray-700 shadow hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <svg *ngIf="!darkMode" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg *ngIf="darkMode" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
            <span>{{ darkMode ? 'Tryb jasny' : 'Tryb ciemny' }}</span>
          </button>
        </div>
        <!-- Centered search box -->
        <div class="flex flex-col items-center gap-2">
          <form (ngSubmit)="presenter.search()" class="flex w-full max-w-xl gap-2 bg-gradient-to-r from-white via-emerald-100 to-emerald-200 dark:from-black dark:via-gray-900 dark:to-gray-950 rounded-xl shadow-lg p-3 backdrop-blur border border-emerald-200 dark:border-gray-800 group">
            <input type="text"
             class="flex-1 px-4 py-3  dark:text-white rounded-lg border-2 border-emerald-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-lg transition-all placeholder:italic placeholder:text-emerald-400 dark:placeholder:text-gray-400 bg-white/80 dark:bg-black/80 group-focus-within:ring-2 group-focus-within:ring-emerald-300" 
             placeholder="🔍 Szukaj leku..." 
             [(ngModel)]="model.query"
              name="query" 
              required aria-label="Szukaj leku" />
            <button type="submit" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-white dark:to-gray-400 text-white dark:text-black font-semibold rounded-lg shadow-lg hover:scale-105 hover:from-emerald-600 hover:to-emerald-800 dark:hover:from-gray-200 dark:hover:to-white transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <span>Szukaj</span>
            </button>
          </form>
          <p class="text-sm text-rose-600 dark:text-gray-200 mt-1 min-h-[1.5em] transition-all" [class.opacity-0]="!model.error">{{ model.error || ' ' }}</p>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 dark:from-white dark:via-gray-200 dark:to-gray-400 drop-shadow">Cześć, {{ model.userName }}</h2>
            <button *ngIf="model.saved.length > 0"
        class="text-sm px-4 py-2 bg-gradient-to-r from-emerald-100 to-white dark:from-gray-800 dark:to-black border-2 border-emerald-200 dark:border-gray-700 rounded-lg text-emerald-700 dark:text-white hover:bg-emerald-50 hover:shadow-lg dark:hover:bg-gray-900 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" 
        (click)="presenter.clearAll()">
  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M6 18L18 6M6 6l12 12"/>
  </svg>
  Wyczyść zapisane
</button>
              
          </div>

          <div class="grid gap-4" *ngIf="model.candidates.length">
            <div #medicineCard class="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 dark:from-black dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-lg p-5 flex flex-col md:flex-row items-start gap-4 border-2 border-emerald-200 dark:border-gray-700 hover:shadow-2xl transition-all animate-fade-in" *ngFor="let c of model.candidates; trackBy: presenter.trackByUrl">
              <img *ngIf="c.imageUrl" [src]="c.imageUrl" class="w-20 h-20 object-cover rounded-xl shadow border-2 border-emerald-200 dark:border-gray-700 animate-fade-in" alt="" />
              <div class="flex-1">
                <a class="font-semibold text-lg text-emerald-700 dark:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-white rounded transition-all" [href]="c.url" target="_blank" rel="noopener">{{ c.name }}</a>
                <p class="text-sm text-gray-700 dark:text-gray-200 mt-1">{{ c.summary || 'Brak opisu.' }}</p>
                <div class="mt-3 flex gap-2">
                  <button class="px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-white dark:to-gray-400 text-white dark:text-black rounded-lg font-medium shadow-lg hover:scale-105 hover:from-emerald-500 hover:to-emerald-700 dark:hover:from-gray-200 dark:hover:to-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400" (click)="presenter.confirmAdd(c)">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    Dodaj
                  </button>
                  <button class="px-4 py-2 bg-gradient-to-r from-white to-emerald-100 dark:from-gray-800 dark:to-black text-emerald-700 dark:text-white rounded-lg font-medium shadow hover:bg-emerald-50 dark:hover:bg-gray-900 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300" (click)="presenter.reject(c)">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    To nie to
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-2">
            <h3 class="text-xl font-semibold text-fuchsia-700 mb-3 drop-shadow">Twoje leki</h3>
            <div class="flex flex-col gap-4" *ngIf="model.saved.length; else emptyState">
              <div #medicineCard class="border-2 w-full border-emerald-200 dark:border-gray-700 rounded-2xl p-5 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 dark:from-black dark:via-gray-900 dark:to-gray-950 shadow flex items-start gap-4 hover:shadow-xl transition-all animate-fade-in" *ngFor="let m of model.saved; trackBy: presenter.trackByUrl">
                <img *ngIf="m.imageUrl" [src]="m.imageUrl" class="w-14 h-14 object-cover rounded-lg border-2 border-emerald-200 dark:border-gray-700 animate-fade-in" alt="" />
                <div class="flex-1 flex flex-col ">
                  <a class="font-medium text-emerald-700 dark:text-white hover:underline text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-white rounded transition-all" [href]="m.url" target="_blank" rel="noopener">{{ m.name }}</a>
                  <p class="text-sm text-gray-700 dark:text-gray-200 mt-1 truncate text-wrap">{{ m.summary }}</p>
                  <button class="text-sm px-2.5 py-1 mt-2 ml-auto m-0.5 bg-gradient-to-r from-white to-emerald-100 dark:from-gray-800 dark:to-red-800 text-emerald-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-900 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center gap-1" (click)="presenter.remove(m)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    Usuń
                  </button>
                  <button class="text-sm px-3 py-1.5 bg-gradient-to-r from-emerald-200 to-emerald-400 dark:from-gray-700 dark:to-gray-900 text-emerald-900 dark:text-white rounded-lg hover:bg-emerald-300 dark:hover:bg-gray-800 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center gap-1" (click)="toggleReminderForm(m)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/></svg>
                    Dodaj przypomnienie
                  </button>

                  <!-- Add/Edit Reminder Form -->
                  <div *ngIf="m._showReminderForm" class="mt-2 p-3 rounded-xl border border-emerald-200 dark:border-gray-700 bg-white dark:bg-black flex flex-wrap gap-2 animate-fade-in">
                    <form (ngSubmit)="saveReminder(m, m._reminderForm)" class="flex flex-col md:flex-row gap-2 items-center flex-wrap">
                      <label class="text-emerald-700 dark:text-white text-sm flex items-center gap-1">
                        Godzina:
                        <input type="time" [(ngModel)]="m._reminderForm.time" name="reminderTime{{m.name}}" required
                          class="ml-1 px-2 py-1 rounded border border-emerald-200 dark:border-gray-700 bg-white dark:bg-black text-emerald-900 dark:text-white" />
                      </label>

                      <label class="text-emerald-700 dark:text-white text-sm flex items-center gap-1">
                        <input type="radio" [(ngModel)]="m._reminderForm.frequency" name="reminderFreq{{m.name}}" value="daily" required /> Codziennie
                      </label>

                      <label class="text-emerald-700 dark:text-white text-sm flex items-center gap-1">
                        <input type="radio" [(ngModel)]="m._reminderForm.frequency" name="reminderFreq{{m.name}}" value="once" required /> Jednorazowo
                      </label>

                      <input *ngIf="m._reminderForm.frequency === 'once'" type="date"
                        [(ngModel)]="m._reminderForm.date"
                        name="reminderDate{{m.name}}"
                        required
                        class="px-2 py-1 rounded border border-emerald-200 dark:border-gray-700 bg-white dark:bg-black text-emerald-900 dark:text-white" />

                      <button type="submit" class="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all">Zapisz</button>
                    </form>
                  </div>

                  <div *ngIf="m.reminders && m.reminders.length" class="mt-2 flex flex-col gap-2">
                    <div *ngFor="let r of m.reminders" class="flex items-center gap-2 bg-emerald-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-emerald-200 dark:border-gray-700">
                    <span class="text-emerald-800 dark:text-white text-sm">
  {{ r.frequency === 'daily' ? 'Codziennie' : 'Jednorazowo' }}
  o {{ r.time }}
  <span *ngIf="r.frequency === 'once' && r.date">({{ r.date }})</span>
</span>
                      <button class="ml-auto text-xs px-2 py-1 rounded bg-emerald-200 dark:bg-gray-800 text-emerald-900 dark:text-white hover:bg-emerald-300 dark:hover:bg-gray-700 transition-all" (click)="toggleReminderForm(m, r)">Edytuj</button>
                      <button class="text-xs px-2 py-1 rounded bg-rose-200 dark:bg-gray-800 text-rose-900 dark:text-white hover:bg-rose-300 dark:hover:bg-gray-700 transition-all" (click)="removeReminder(m, r.id)">Usuń</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <ng-template #emptyState>
              <div class="flex flex-col items-center justify-center py-8 opacity-70 animate-fade-in">
                <svg class="w-16 h-16 mb-2 text-emerald-200 dark:text-gray-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M8 7V5a4 4 0 1 1 8 0v2"/></svg>
                <p class="text-emerald-500 dark:text-gray-200 italic text-center text-lg">Brak zapisanych leków.<br><span class="text-xs">Dodaj lek, aby pojawił się tutaj.</span></p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: none; }
    }
    .animate-fade-in {
      animation: fade-in 0.7s cubic-bezier(.4,0,.2,1);
    }
  `],
})
export class MedicinesComponent implements AfterViewInit, OnInit {
  @ViewChildren('medicineCard') medicineCards!: QueryList<ElementRef>;
  readonly bg = 'linear-gradient(135deg,#f0fdf4,#eff6ff)';
  model = new MedicinesModel();
  presenter: MedicinesPresenter;
  darkMode = false;

  constructor(private cdr: ChangeDetectorRef) {
    const medicineService = inject(MedicineService);
    this.presenter = new MedicinesPresenter(this.model, medicineService);
    this.darkMode = localStorage.getItem('darkMode') === 'true';
  }

  ngOnInit() {
    this.initReminderUIState();
  }

  private initReminderUIState() {
    for (const m of this.model.saved) {
      (m as any)._showReminderForm = false;
      (m as any)._editingReminderId = null;
      (m as any)._reminderForm = { time: '', frequency: 'daily', date: '', enabled: true };
    }
  }

  ngAfterViewInit() {
    import('gsap').then(gsapModule => {
      const gsap = gsapModule.gsap;
      if (this.medicineCards && this.medicineCards.length) {
        gsap.fromTo(
          this.medicineCards.map(ref => ref.nativeElement),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power2.out' }
        );
      }
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode ? 'true' : 'false');
    this.cdr.detectChanges();
    import('gsap').then(gsapModule => {
      const gsap = gsapModule.gsap;
      gsap.fromTo(
        '.min-h-screen',
        { filter: 'brightness(0.7) blur(2px)' },
        { filter: 'brightness(1) blur(0px)', duration: 0.5, ease: 'power2.out' }
      );
      if (this.medicineCards && this.medicineCards.length) {
        gsap.fromTo(
          this.medicineCards.map(ref => ref.nativeElement),
          { opacity: 0.7, scale: 0.97 },
          { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'power1.out' }
        );
      }
    });
  }

 toggleReminderForm(m: any, editReminder: any = null) {
  m._showReminderForm = !m._showReminderForm;
  if (m._showReminderForm) {
    if (editReminder) {
      m._editingReminderId = editReminder.id;
      m._reminderForm = { ...editReminder };
    } else {
      m._editingReminderId = null;
      // jeśli już jest ustawiony czas, zachowaj go
      m._reminderForm = { 
        time: m._reminderForm?.time || '', 
        frequency: 'daily', 
        date: m._reminderForm?.date || '', 
        enabled: true 
      };
    }
  }
}

 saveReminder(m: any, form: any) {
  if (!form.time) form.time = '00:00';  // fallback jeśli nie ustawiono
  if (!form.date) form.date = '';       // fallback
  if (!m.reminders) m.reminders = [];

  if (m._editingReminderId) {
    const idx = m.reminders.findIndex((r: any) => r.id === m._editingReminderId);
    if (idx !== -1) m.reminders[idx] = { ...form, id: m._editingReminderId };
  } else {
    const id = Math.random().toString(36).slice(2) + Date.now();
    m.reminders.push({ ...form, id });
  }

  m._showReminderForm = false;
  m._editingReminderId = null;
  this.model.saved = this.model.saved.map((x: any) => x.name === m.name ? m : x);
  MedicinesModel.writeSaved(this.model.saved);
  this.initReminderUIState();
  this.cdr.detectChanges();
}

  removeReminder(m: any, reminderId: string) {
    m.reminders = (m.reminders || []).filter((r: any) => r.id !== reminderId);
    this.model.saved = this.model.saved.map((x: any) => x.name === m.name ? m : x);
    MedicinesModel.writeSaved(this.model.saved);
    this.initReminderUIState();
    this.cdr.detectChanges();
  }
}