import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationStateService } from '../../core/services/navigation-state.service';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail.component.html',
})
export class CharacterDetailComponent implements OnInit {
  private router = inject(Router);
  private navigationState = inject(NavigationStateService);

  character = this.navigationState.selectedCharacter;

  ngOnInit() {
    if (!this.character()) {
      this.router.navigate(['/characters']);
    }
  }
}
