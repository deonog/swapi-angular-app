import { Component, ElementRef, viewChild, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-film-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-film-modal.component.html',
})
export class AddFilmModalComponent {
  private fb = inject(FormBuilder);
  // Reference to the HTML dialog element
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  close = output<void>();
  submit = output<void>();

  // Form setup for film data
  filmForm: FormGroup = this.fb.group({
    title: [''],
    director: [''],
    producer: [''],
    releaseDate: [''],
    description: ['']
  });

  open() {
    this.dialog()?.nativeElement.showModal();
  }

  closeModal() {
    // Clear form data when closing
    this.filmForm.reset();
    this.dialog()?.nativeElement.close();
    this.close.emit();
  }

  onCancel() {
    this.closeModal();
  }
}
