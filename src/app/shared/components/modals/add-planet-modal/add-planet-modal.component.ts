import { Component, ElementRef, viewChild, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-planet-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-planet-modal.component.html',
})
export class AddPlanetModalComponent {
  private fb = inject(FormBuilder);
  // Dialog element reference for modal control
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  close = output<void>();
  submit = output<void>();

  // Planet form with all the required fields
  planetForm: FormGroup = this.fb.group({
    name: [''],
    type: [''],
    createdBy: [''],
    genre: [''],
    races: ['']
  });

  open() {
    this.dialog()?.nativeElement.showModal();
  }

  closeModal() {
    // Reset form on close
    this.planetForm.reset();
    this.dialog()?.nativeElement.close();
    this.close.emit();
  }

  onCancel() {
    this.closeModal();
  }
}
