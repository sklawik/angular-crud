import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule],
  template:`
    <div class="min-h-screen flex items-center justify-center p-6" [style.background]="bg">
      <div class="w-full max-w-md bg-white/80 backdrop-blur shadow-xl rounded-xl p-6" [style.borderRadius.px]="16">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Witamy</h2>
        <p class="text-gray-600 mb-4">Proszę wprowadzić swoje imię, aby kontynuować:</p>
        <form (ngSubmit)="submit()" class="space-y-3">
          <input
            type="text"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Twoje imię"
            [ngModel]="name()"
            (ngModelChange)="name.set($event)"
            name="name"
            required
          />
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg">Kontynuuj</button>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class WelcomeComponent {
  @Output() confirmed = new EventEmitter<string>();
  name = signal<string>('');
  readonly bg = 'linear-gradient(135deg,#eef2ff,#faf5ff)';

  submit() {
    const trimmed = this.name().trim();
    if (trimmed) this.confirmed.emit(trimmed);
  }
}