import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Film } from '../../core/models/film.model';
import { CardField, ResourceCardComponent } from '../../shared/components/resource-card/resource-card.component';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { Router } from '@angular/router';
import { SwapiService } from '../../core/services/swapi.service';
import { People } from '../../core/models/people.model';
import { getPeopleFields } from '../../core/utils/people.util';
import { ApiResponse } from '../../core/models/api-response.model';
import { Observable } from 'rxjs';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, ResourceCardComponent, PaginationComponent],
  templateUrl: './characters.component.html',
})
export class CharactersComponent {
  private swapiService = inject(SwapiService);
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);
  people = signal<People[]>([]);
  nextPage = signal<string | null>(null);
  previousPage = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  navigateToDetail(character: People) {
    this.navigationState.setCharacter(character);
    this.router.navigate(['/characters/detail']);
  }

  getPeopleFields(character: People): CardField[] {
    return getPeopleFields(character);
  }

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople(url?: string) {
    this.loading.set(true);
    // Handle both first load and pagination
    const apiCall: Observable<ApiResponse<People>> = url
      ? this.swapiService.getPeopleByUrl(url)
      : this.swapiService.getPeople();

    apiCall.subscribe({
      next: (response: ApiResponse<People>) => {
        this.people.set(response.results);
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
      this.loadPeople(nextUrl);
    }
  }

  loadPreviousPage() {
    const prevUrl = this.previousPage();
    if (prevUrl) {
      this.loadPeople(prevUrl);
    }
  }
}