import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { SwapiService } from '../../core/services/swapi.service';
import { Film } from '../../core/models/film.model';
import { People } from '../../core/models/people.model';
import { Planet } from '../../core/models/planet.model';
import { forkJoin } from 'rxjs';
import { catchError, map, of } from 'rxjs';
import { DetailField } from '../../shared/components/detail-content/detail-content.component';
import { ResourceChipsComponent, ResourceItem } from '../../shared/components/resource-chips/resource-chips.component';
import { DetailHeaderComponent } from '../../shared/components/detail-header/detail-header.component';
import { DetailLayoutComponent } from '../../shared/components/detail-layout/detail-layout.component';
import { getPlanetFields } from '../../core/utils/planet.util';

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [CommonModule, ResourceChipsComponent, DetailHeaderComponent, DetailLayoutComponent],
  templateUrl: './planet-detail.component.html',
})
export class PlanetDetailComponent implements OnInit {
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);
  private swapiService = inject(SwapiService);

  planet = this.navigationState.selectedPlanet;

  residents = signal<People[]>([]);
  films = signal<Film[]>([]);
  error = signal<string | null>(null);

  ngOnInit() {
    if (!this.planet()) {
      this.router.navigate(['/planets']);
      return;
    }

    this.loadRelatedResources();
  }

  loadRelatedResources() {
    const planetData = this.planet();
    if (!planetData) return;

    const residents$ = planetData.residents.length > 0
      ? forkJoin(
        planetData.residents.map(url =>
          this.swapiService.getPersonByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as People[]))
      : of([]);

    const films$ = planetData.films.length > 0
      ? forkJoin(
        planetData.films.map(url =>
          this.swapiService.getFilmByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Film[]))
      : of([]);

    forkJoin({
      residents: residents$,
      films: films$
    }).subscribe({
      next: (results) => {
        this.residents.set(results.residents);
        this.films.set(results.films);
        this.error.set(null);
      },
      error: (error: Error) => {
        this.error.set('Failed to load related resources. Please try again later.');
      }
    });
  }

  onResidentClick(item: ResourceItem) {
    const resident = this.residents().find(r => r.url === item.url);
    if (resident) {
      this.navigationState.setCharacter(resident);
      this.router.navigate(['/characters/detail']);
    }
  }

  onFilmClick(item: ResourceItem) {
    const film = this.films().find(f => f.url === item.url);
    if (film) {
      this.navigationState.setFilm(film);
      this.router.navigate(['/films/detail']);
    }
  }

  onAddClick(resourceType: string) {
    console.log(`Add ${resourceType} clicked`);
  }

  private toResourceItems<T extends { name: string; url: string }>(items: T[]): ResourceItem[] {
    return items.map(item => ({ name: item.name, url: item.url }));
  }

  getResidentItems(): ResourceItem[] {
    return this.toResourceItems(this.residents());
  }

  getFilmItems(): ResourceItem[] {
    return this.films().map(film => ({ name: film.title, url: film.url }));
  }

  getPlanetFields(): DetailField[] {
    const planetData = this.planet();
    if (!planetData) return [];
    return getPlanetFields(planetData);
  }
}
