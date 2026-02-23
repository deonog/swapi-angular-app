import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SwapiService } from '../../core/services/swapi.service';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { Film } from '../../core/models/film.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { ResourceCardComponent, CardField } from '../../shared/components/resource-card/resource-card.component';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, ResourceCardComponent],
  templateUrl: './films.component.html',
})
export class FilmsComponent {
  private swapiService = inject(SwapiService);
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);
  films = signal<Film[]>([]);
  nextPage = signal<string | null>(null);
  previousPage = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  navigateToDetail(film: Film) {
    this.navigationState.setFilm(film);
    this.router.navigate(['/films/detail']);
  }

  getFilmFields(film: Film): CardField[] {
    return [
      { label: 'Director', value: film.director },
      { label: 'Produzenten', value: film.producer },
      { label: 'Erscheinungsdatum', value: this.formatDate(film.release_date) }
    ];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms(url?: string) {
    this.loading.set(true);
    // Handle both first load and pagination
    const apiCall = url
      ? this.swapiService.getFilmsByUrl(url)
      : this.swapiService.getFilms();

    apiCall.subscribe({
      next: (response: ApiResponse<Film>) => {
        console.log(response);
        this.films.set(response.results);
        // Save the next/prev URLs for pagination buttons
        this.nextPage.set(response.next);
        this.previousPage.set(response.previous);
      },
      error: (error: Error) => {
        this.error.set(error.message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  loadNextPage() {
    const nextUrl = this.nextPage();
    if (nextUrl) {
      this.loadFilms(nextUrl);
    }
  }

  loadPreviousPage() {
    const prevUrl = this.previousPage();
    if (prevUrl) {
      this.loadFilms(prevUrl);
    }
  }
}