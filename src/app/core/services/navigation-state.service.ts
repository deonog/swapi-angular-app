import { Injectable, signal } from '@angular/core';
import { Film } from '../models/film.model';
import { People } from '../models/people.model';
import { Planet } from '../models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // SWAPI doesn't have simple IDs, so we pass the whole object via signals
  // Easier than trying to extract IDs from URLs
  private _selectedFilm = signal<Film | null>(null);
  private _selectedCharacter = signal<People | null>(null);
  private _selectedPlanet = signal<Planet | null>(null);

  // Read-only so components can't mess with the state directly
  selectedFilm = this._selectedFilm.asReadonly();
  selectedCharacter = this._selectedCharacter.asReadonly();
  selectedPlanet = this._selectedPlanet.asReadonly();

  setFilm(film: Film) {
    this._selectedFilm.set(film);
  }

  setCharacter(character: People) {
    this._selectedCharacter.set(character);
  }

  setPlanet(planet: Planet) {
    this._selectedPlanet.set(planet);
  }

  clearFilm() {
    this._selectedFilm.set(null);
  }

  clearCharacter() {
    this._selectedCharacter.set(null);
  }

  clearPlanet() {
    this._selectedPlanet.set(null);
  }
}
