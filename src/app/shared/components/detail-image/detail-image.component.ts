import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-image.component.html',
})
export class DetailImageComponent {
  imageUrl = input<string | null>(null);
  altText = input<string>('Image');
}
