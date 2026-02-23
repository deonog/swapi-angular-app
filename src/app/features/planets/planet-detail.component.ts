import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationStateService } from '../../core/services/navigation-state.service';

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet-detail.component.html',
})
export class PlanetDetailComponent implements OnInit {
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);

  planet = this.navigationState.selectedPlanet;

  ngOnInit() {
    if (!this.planet()) {
      this.router.navigate(['/planets']);
    }
  }
}
