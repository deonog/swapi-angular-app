import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  hasPrevious = input.required<boolean>();
  hasNext = input.required<boolean>();

  previousClick = output<void>();
  nextClick = output<void>();

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.nextClick.emit();
  }
}
