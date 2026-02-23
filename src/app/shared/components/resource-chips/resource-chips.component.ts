import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ResourceItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-resource-chips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-chips.component.html',
})
export class ResourceChipsComponent {
  title = input.required<string>();
  items = input.required<ResourceItem[]>();

  clickable = input<boolean>(false);
  showAddButton = input<boolean>(true);

  itemClick = output<ResourceItem>();
  addClick = output<void>();

  onItemClick(item: ResourceItem) {
    // Only fire the event if clickable is enabled
    // Reusing this component for both clickable and non-clickable resources
    if (this.clickable()) {
      this.itemClick.emit(item);
    }
  }

  onAddClick() {
    this.addClick.emit();
  }
}
