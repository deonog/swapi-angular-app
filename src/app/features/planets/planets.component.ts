import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planet } from '../../core/models/planet.model';
import { NavigationStateService } from '../../core/services/navigation-state.service';
import { SwapiService } from '../../core/services/swapi.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../core/models/api-response.model';
import { ResourceCardComponent, CardField } from '../../shared/components/resource-card/resource-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { getPlanetFields } from '../../core/utils/planet.util';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [CommonModule, ResourceCardComponent, PaginationComponent],
  templateUrl: './planets.component.html',
})
export class PlanetsComponent {
  private swapiService = inject(SwapiService);
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);
  planets = signal<Planet[]>([]);
  nextPage = signal<string | null>(null);
  previousPage = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  navigateToDetail(planet: Planet) {
    this.navigationState.setPlanet(planet);
    this.router.navigate(['/planets/detail']);
  }

  getPlanetFields(planet: Planet): CardField[] {
    return getPlanetFields(planet);
  }

  ngOnInit() {
    this.loadPlanets();
  }

  loadPlanets(url?: string) {
    this.loading.set(true);
    // Handle both first load and pagination
    const apiCall = url
      ? this.swapiService.getPlanetsByUrl(url)
      : this.swapiService.getPlanets();

    apiCall.subscribe({
      next: (response: ApiResponse<Planet>) => {
        this.planets.set(response.results);
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
      this.loadPlanets(nextUrl);
    }
  }

  loadPreviousPage() {
    const prevUrl = this.previousPage();
    if (prevUrl) {
      this.loadPlanets(prevUrl);
    }
  }
}