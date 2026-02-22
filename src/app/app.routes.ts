import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'films', loadComponent: () => import('./features/films/films.component').then(m => m.FilmsComponent) },
  { path: 'characters', loadComponent: () => import('./features/characters/characters.component').then(m => m.CharactersComponent) },
  { path: 'planets', loadComponent: () => import('./features/planets/planets.component').then(m => m.PlanetsComponent) },
];
