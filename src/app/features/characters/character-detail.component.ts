import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { SwapiService } from '../../core/services/swapi.service';
import { Film } from '../../core/models/film.model';
import { People } from '../../core/models/people.model';
import { Planet } from '../../core/models/planet.model';
import { Starship } from '../../core/models/starship.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { forkJoin } from 'rxjs';
import { catchError, map, of } from 'rxjs';
import { DetailField } from '../../shared/components/detail-content/detail-content.component';
import { ResourceChipsComponent, ResourceItem } from '../../shared/components/resource-chips/resource-chips.component';
import { DetailHeaderComponent } from '../../shared/components/detail-header/detail-header.component';
import { DetailLayoutComponent } from '../../shared/components/detail-layout/detail-layout.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { getPeopleFields } from '../../core/utils/people.util';
import { AddFilmModalComponent } from '../../shared/components/modals/add-film-modal/add-film-modal.component';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, ResourceChipsComponent, DetailHeaderComponent, DetailLayoutComponent, ErrorMessageComponent, AddFilmModalComponent],
  templateUrl: './character-detail.component.html',
})
export class CharacterDetailComponent implements OnInit {
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);
  private swapiService = inject(SwapiService);

  character = this.navigationState.selectedCharacter;

  films = signal<Film[]>([]);
  starships = signal<Starship[]>([]);
  vehicles = signal<Vehicle[]>([]);
  error = signal<string | null>(null);

  addFilmModal = viewChild(AddFilmModalComponent);

  ngOnInit() {
    if (!this.character()) {
      this.router.navigate(['/characters']);
      return;
    }

    this.loadRelatedResources();
  }

  loadRelatedResources() {
    const characterData = this.character();
    if (!characterData) return;

    const films$ = characterData.films.length > 0
      ? forkJoin(
        characterData.films.map(url =>
          this.swapiService.getFilmByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Film[]))
      : of([]);

    const starships$ = characterData.starships.length > 0
      ? forkJoin(
        characterData.starships.map(url =>
          this.swapiService.getStarshipByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Starship[]))
      : of([]);

    const vehicles$ = characterData.vehicles.length > 0
      ? forkJoin(
        characterData.vehicles.map(url =>
          this.swapiService.getVehicleByUrl(url).pipe(
            catchError(() => of(null))
          )
        )
      ).pipe(map(results => results.filter(r => r !== null) as Vehicle[]))
      : of([]);

    forkJoin({
      films: films$,
      starships: starships$,
      vehicles: vehicles$
    }).subscribe({
      next: (results) => {
        this.films.set(results.films);
        this.starships.set(results.starships);
        this.vehicles.set(results.vehicles);
        this.error.set(null);
      },
      error: (error: Error) => {
        this.error.set('Failed to load related resources. Please try again later.');
      }
    });
  }

  onFilmClick(item: ResourceItem) {
    const film = this.films().find(f => f.url === item.url);
    if (film) {
      this.navigationState.setFilm(film);
      this.router.navigate(['/films/detail']);
    }
  }

  // Handles opening modals when add button is clicked on resource chips
  onAddClick(resourceType: string) {
    if (resourceType === 'film') {
      this.addFilmModal()?.open();
    }
  }

  private toResourceItems<T extends { name: string; url: string }>(items: T[]): ResourceItem[] {
    return items.map(item => ({ name: item.name, url: item.url }));
  }

  getFilmItems(): ResourceItem[] {
    return this.films().map(film => ({ name: film.title, url: film.url }));
  }

  getStarshipItems(): ResourceItem[] {
    return this.toResourceItems(this.starships());
  }

  getVehicleItems(): ResourceItem[] {
    return this.toResourceItems(this.vehicles());
  }

  getPeopleFields(): DetailField[] {
    const characterData = this.character();
    if (!characterData) return [];
    return getPeopleFields(characterData);
  }
}
