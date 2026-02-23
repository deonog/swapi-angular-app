import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  // Error message to display - can be null/undefined when there's no error
  error = input<string | null>(null);

  // Optional custom CSS classes for the error container
  containerClass = input<string>('mb-6');
}
