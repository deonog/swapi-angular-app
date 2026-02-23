import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { SwapiService } from '../../core/services/swapi.service';
import { People } from '../../core/models/people.model';
import { Planet } from '../../core/models/planet.model';
import { Starship } from '../../core/models/starship.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { ResourceChipsComponent, ResourceItem } from '../../shared/components/resource-chips/resource-chips.component';
import { DetailHeaderComponent } from '../../shared/components/detail-header/detail-header.component';
import { DetailLayoutComponent } from '../../shared/components/detail-layout/detail-layout.component';
import { DetailField } from '../../shared/components/detail-content/detail-content.component';
import { getFilmFields } from '../../core/utils/film.util';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [CommonModule, ResourceChipsComponent, DetailHeaderComponent, DetailLayoutComponent],
  templateUrl: './film-detail.component.html',
})
export class FilmDetailComponent implements OnInit {
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);
  private swapiService = inject(SwapiService);

  film = this.navigationState.selectedFilm;

  characters = signal<People[]>([]);
  planets = signal<Planet[]>([]);
  starships = signal<Starship[]>([]);
  vehicles = signal<Vehicle[]>([]);
  loading = signal(false);

  ngOnInit() {
    if (!this.film()) {
      this.router.navigate(['/films']);
      return;
    }

    this.loadRelatedResources();
  }

  loadRelatedResources() {
    const filmData = this.film();
    if (!filmData) return;

    this.loading.set(true);

    // SWAPI only gives us URLs, gotta fetch each one separately
    // Using forkJoin with object for better type safety
    const characters$ = filmData.characters.length > 0
      ? forkJoin(
        filmData.characters.map(url =>
          this.swapiService.getPersonByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as People[]))
      : of([]);

    const planets$ = filmData.planets.length > 0
      ? forkJoin(
        filmData.planets.map(url =>
          this.swapiService.getPlanetByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Planet[]))
      : of([]);

    const starships$ = filmData.starships.length > 0
      ? forkJoin(
        filmData.starships.map(url =>
          this.swapiService.getStarshipByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Starship[]))
      : of([]);

    const vehicles$ = filmData.vehicles.length > 0
      ? forkJoin(
        filmData.vehicles.map(url =>
          this.swapiService.getVehicleByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Vehicle[]))
      : of([]);

    forkJoin({
      characters: characters$,
      planets: planets$,
      starships: starships$,
      vehicles: vehicles$
    }).subscribe({
      next: (results) => {
        this.characters.set(results.characters);
        this.planets.set(results.planets);
        this.starships.set(results.starships);
        this.vehicles.set(results.vehicles);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onCharacterClick(item: ResourceItem) {
    const character = this.characters().find(c => c.url === item.url);
    if (character) {
      this.navigationState.setCharacter(character);
      this.router.navigate(['/characters/detail']);
    }
  }

  onPlanetClick(item: ResourceItem) {
    const planet = this.planets().find(p => p.url === item.url);
    if (planet) {
      this.navigationState.setPlanet(planet);
      this.router.navigate(['/planets/detail']);
    }
  }

  onAddClick(resourceType: string) {
    console.log(`Add ${resourceType} clicked`);
  }

  private toResourceItems<T extends { name: string; url: string }>(items: T[]): ResourceItem[] {
    return items.map(item => ({ name: item.name, url: item.url }));
  }

  getCharacterItems(): ResourceItem[] {
    return this.toResourceItems(this.characters());
  }

  getPlanetItems(): ResourceItem[] {
    return this.toResourceItems(this.planets());
  }

  getStarshipItems(): ResourceItem[] {
    return this.toResourceItems(this.starships());
  }

  getVehicleItems(): ResourceItem[] {
    return this.toResourceItems(this.vehicles());
  }

  getFilmFields(): DetailField[] {
    const filmData = this.film();
    if (!filmData) return [];
    return getFilmFields(filmData);
  }

  getFilmDescription(): string | null {
    return this.film()?.opening_crawl || null;
  }
}