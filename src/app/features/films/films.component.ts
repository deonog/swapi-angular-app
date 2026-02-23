import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { Film } from '../../core/models/film.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { ResourceCardComponent, CardField } from '../../shared/components/resource-card/resource-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { getFilmFields } from '../../core/utils/film.util';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, ResourceCardComponent, PaginationComponent],
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
    return getFilmFields(film);
  }

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms(url?: string) {
    this.loading.set(true);
    // Handle both first load and pagination
    const apiCall: Observable<ApiResponse<Film>> = url
      ? this.swapiService.getFilmsByUrl(url)
      : this.swapiService.getFilms();

    apiCall.subscribe({
      next: (response: ApiResponse<Film>) => {
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