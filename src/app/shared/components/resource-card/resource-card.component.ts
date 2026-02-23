import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CardField {
  label: string;
  value: string;
}

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-card.component.html',
})
export class ResourceCardComponent {
  title = input.required<string>();
  fields = input.required<CardField[]>();

  imageUrl = input<string | null>(null);
  linkText = input<string>('More Information...');

  linkClick = output<void>();

  onLinkClick() {
    this.linkClick.emit();
  }
}
