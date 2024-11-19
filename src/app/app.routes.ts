import { Routes } from '@angular/router';
import { PuzzleComponent } from './puzzle/puzzle.component';

export const routes: Routes = [
  { path: '', redirectTo: '/puzzle', pathMatch: 'full' },
  { path: 'puzzle', component: PuzzleComponent }
];