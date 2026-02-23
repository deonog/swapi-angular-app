import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailField {
  label: string;
  value: string;
}

@Component({
  selector: 'app-detail-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-content.component.html',
})
export class DetailContentComponent {
  fields = input<DetailField[]>([]);
  description = input<string | null>(null);
}
