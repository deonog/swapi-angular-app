import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'films', loadComponent: () => import('./features/films/films.component').then(m => m.FilmsComponent) },
  { path: 'films/detail', loadComponent: () => import('./features/films/film-detail.component').then(m => m.FilmDetailComponent) },
  { path: 'characters', loadComponent: () => import('./features/characters/characters.component').then(m => m.CharactersComponent) },
  { path: 'characters/detail', loadComponent: () => import('./features/characters/character-detail.component').then(m => m.CharacterDetailComponent) },
  { path: 'planets', loadComponent: () => import('./features/planets/planets.component').then(m => m.PlanetsComponent) },
  { path: 'planets/detail', loadComponent: () => import('./features/planets/planet-detail.component').then(m => m.PlanetDetailComponent) },
];
