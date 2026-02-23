import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailContentComponent } from '../detail-content/detail-content.component';
import { DetailImageComponent } from '../detail-image/detail-image.component';

@Component({
  selector: 'app-detail-layout',
  standalone: true,
  imports: [CommonModule, DetailContentComponent, DetailImageComponent],
  templateUrl: './detail-layout.component.html',
})
export class DetailLayoutComponent {
  contentFields = input<any[]>([]);
  description = input<string | null>(null);
  
  imageUrl = input<string | null>(null);
  imageAltText = input<string>('Image');
}
