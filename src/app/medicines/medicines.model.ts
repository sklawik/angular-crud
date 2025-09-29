import { MedicineCandidate, MedicineReminder } from '../services/medicine.service';

export class MedicinesModel {
  userName: string = localStorage.getItem('userName') ?? 'User';
  query: string = '';
  candidates: MedicineCandidate[] = [];
  saved: MedicineCandidate[] = MedicinesModel.readSaved();
  error: string | null = null;

  static readSaved(): MedicineCandidate[] {
    try {
      const raw = localStorage.getItem('medicines');
      return raw ? (JSON.parse(raw) as MedicineCandidate[]) : [];
    } catch {
      return [];
    }
  }

  static writeSaved(data: MedicineCandidate[]) {
    localStorage.setItem('medicines', JSON.stringify(data));
  }

  // Helper to update reminder for a saved medicine
  // Add, update, or remove reminders for a medicine by name
  static addReminder(name: string, reminder: MedicineReminder) {
    const saved = MedicinesModel.readSaved();
    const idx = saved.findIndex(m => m.name === name);
    if (idx !== -1) {
      if (!saved[idx].reminders) saved[idx].reminders = [];
      saved[idx].reminders.push(reminder);
      MedicinesModel.writeSaved(saved);
    }
  }

  static updateReminder(name: string, reminder: MedicineReminder) {
    const saved = MedicinesModel.readSaved();
    const idx = saved.findIndex(m => m.name === name);
    if (idx !== -1 && saved[idx].reminders) {
      const rIdx = saved[idx].reminders.findIndex(r => r.id === reminder.id);
      if (rIdx !== -1) {
        saved[idx].reminders[rIdx] = reminder;
        MedicinesModel.writeSaved(saved);
      }
    }
  }

  static removeReminder(name: string, reminderId: string) {
    const saved = MedicinesModel.readSaved();
    const idx = saved.findIndex(m => m.name === name);
    if (idx !== -1 && saved[idx].reminders) {
      saved[idx].reminders = saved[idx].reminders.filter(r => r.id !== reminderId);
      MedicinesModel.writeSaved(saved);
    }
  }
}
