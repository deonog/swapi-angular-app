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
    console.log(this.film());
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

    const requests: any[] = [];

    // SWAPI only gives us URLs, gotta fetch each one separately
    // forkJoin runs them all at once instead of waiting for each
    if (filmData.characters.length > 0) {
      requests.push(
        forkJoin(
          filmData.characters.map(url =>
            this.swapiService.getPersonByUrl(url).pipe(
              catchError(() => of(null))
            )
          )
        ).pipe(map(results => results.filter(r => r !== null) as People[]))
      );
    } else {
      requests.push(of([]));
    }

    if (filmData.planets.length > 0) {
      requests.push(
        forkJoin(
          filmData.planets.map(url =>
            this.swapiService.getPlanetByUrl(url).pipe(
              catchError(() => of(null))
            )
          )
        ).pipe(map(results => results.filter(r => r !== null) as Planet[]))
      );
    } else {
      requests.push(of([]));
    }

    if (filmData.starships.length > 0) {
      requests.push(
        forkJoin(
          filmData.starships.map(url =>
            this.swapiService.getStarshipByUrl(url).pipe(
              catchError(() => of(null))
            )
          )
        ).pipe(map(results => results.filter(r => r !== null) as Starship[]))
      );
    } else {
      requests.push(of([]));
    }

    if (filmData.vehicles.length > 0) {
      requests.push(
        forkJoin(
          filmData.vehicles.map(url =>
            this.swapiService.getVehicleByUrl(url).pipe(
              catchError(() => of(null))
            )
          )
        ).pipe(map(results => results.filter(r => r !== null) as Vehicle[]))
      );
    } else {
      requests.push(of([]));
    }

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        this.characters.set((results[0] || []) as People[]);
        this.planets.set((results[1] || []) as Planet[]);
        this.starships.set((results[2] || []) as Starship[]);
        this.vehicles.set((results[3] || []) as Vehicle[]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  navigateToCharacter(character: People) {
    this.navigationState.setCharacter(character);
    this.router.navigate(['/characters/detail']);
  }

  navigateToPlanet(planet: Planet) {
    this.navigationState.setPlanet(planet);
    this.router.navigate(['/planets/detail']);
  }

  onCharacterClick(item: ResourceItem) {
    // Need to find the full object since we only get name/url from the chip
    const character = this.characters().find(c => c.url === item.url);
    if (character) {
      this.navigateToCharacter(character);
    }
  }

  onPlanetClick(item: ResourceItem) {
    const planet = this.planets().find(p => p.url === item.url);
    if (planet) {
      this.navigateToPlanet(planet);
    }
  }

  onAddCharacter() {
    console.log('Add character clicked');
  }

  onAddPlanet() {
    console.log('Add planet clicked');
  }

  onAddStarship() {
    console.log('Add starship clicked');
  }

  onAddVehicle() {
    console.log('Add vehicle clicked');
  }

  getCharacterItems(): ResourceItem[] {
    return this.characters().map(c => ({ name: c.name, url: c.url }));
  }

  getPlanetItems(): ResourceItem[] {
    return this.planets().map(p => ({ name: p.name, url: p.url }));
  }

  getStarshipItems(): ResourceItem[] {
    return this.starships().map(s => ({ name: s.name, url: s.url }));
  }

  getVehicleItems(): ResourceItem[] {
    return this.vehicles().map(v => ({ name: v.name, url: v.url }));
  }

  getFilmFields(): DetailField[] {
    const filmData = this.film();
    if (!filmData) return [];

    return [
      { label: 'Director', value: filmData.director },
      { label: 'Producer', value: filmData.producer },
      { label: 'Release Date', value: this.formatDate(filmData.release_date) }
    ];
  }

  getFilmDescription(): string | null {
    return this.film()?.opening_crawl || null;
  }

  formatDate(dateString: string): string {
    // German date format for the UI
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}