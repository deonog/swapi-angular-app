import { Component, ElementRef, viewChild, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-character-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-character-modal.component.html',
})
export class AddCharacterModalComponent {
  private fb = inject(FormBuilder);
  // Reference to the HTML dialog element so we can open/close it programmatically
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  close = output<void>();
  submit = output<void>();

  // Reactive form for character data - all fields optional for now
  characterForm: FormGroup = this.fb.group({
    name: [''],
    height: [''],
    weight: [''],
    hairColor: [''],
    eyeColor: [''],
    birthYear: [''],
    sex: ['']
  });

  open() {
    // Using native HTML dialog API to show the modal
    this.dialog()?.nativeElement.showModal();
  }

  closeModal() {
    // Reset form when closing so it's clean next time it opens
    this.characterForm.reset();
    this.dialog()?.nativeElement.close();
    this.close.emit();
  }

  onCancel() {
    this.closeModal();
  }
}
