import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-header.component.html',
})
export class DetailHeaderComponent {
  title = input.required<string>();
  subtitle = input<string | null>(null);
  pageLabel = input<string>('Details');
}
