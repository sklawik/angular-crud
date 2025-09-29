import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome/welcome.page';
import { MedicinesComponent } from './medicines/medicines.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'medicines', component: MedicinesComponent },
  { path: '**', redirectTo: '' }
];

