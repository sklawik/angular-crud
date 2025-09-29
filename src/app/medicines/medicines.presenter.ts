import { MedicineService, MedicineCandidate } from '../services/medicine.service';
import { MedicinesModel } from './medicines.model';

export class MedicinesPresenter {
  constructor(private model: MedicinesModel, private medicineService: MedicineService) {}

  search() {
    this.model.error = null;
    const q = this.model.query.trim();
    if (!q) return;
    this.medicineService.searchMedicine(q).subscribe({
      next: (list) => {
        this.model.candidates = list.slice(0, 5);
        if (list[0]?.name) {
          this.medicineService.getMedicineDetails(list[0].name).subscribe((d) => {
            if (!d) return;
            const updated = [d, ...list.slice(1)].slice(0, 5);
            this.model.candidates = updated;
          });
        }
      },
      error: () => (this.model.error = 'Failed to fetch results. Please try again.'),
    });
  }

  confirmAdd(c: MedicineCandidate) {
    const exists = this.model.saved.some((m) => m.url === c.url);
    if (!exists) {
      const next = [...this.model.saved, c];
      this.model.saved = next;
      MedicinesModel.writeSaved(next);
    }
    this.model.candidates = [];
    this.model.query = '';
  }

  reject(c: MedicineCandidate) {
    this.model.candidates = this.model.candidates.filter((x) => x.url !== c.url);
  }

  remove(m: MedicineCandidate) {
    const next = this.model.saved.filter((x) => x.url !== m.url);
    this.model.saved = next;
    MedicinesModel.writeSaved(next);
  }

  clearAll() {
    this.model.saved = [];
    MedicinesModel.writeSaved([]);
  }

  trackByUrl(_: number, item: MedicineCandidate) {
    return item.url;
  }
}
