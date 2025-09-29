import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [WelcomeComponent],
  template: `
    <app-welcome (confirmed)="onConfirmed($event)"></app-welcome>
  `,
  styles: [],
})

export class WelcomePageComponent {
  constructor(private router: Router) {}

  onConfirmed(name: string) {
    localStorage.setItem('userName', name);
    this.router.navigateByUrl('/medicines');
  }
}


