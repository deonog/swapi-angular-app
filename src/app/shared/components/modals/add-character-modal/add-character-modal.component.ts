import { Component, ElementRef, viewChild, output, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-character-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-character-modal.component.html',
})
export class AddCharacterModalComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  // Reference to the HTML dialog element so we can open/close it programmatically
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');

  close = output<void>();
  submit = output<void>();

  private previousActiveElement: HTMLElement | null = null;

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

  ngAfterViewInit() {
    // Listen for ESC key on dialog
    const dialogEl = this.dialog()?.nativeElement;
    if (dialogEl) {
      dialogEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      });
    }
  }

  open() {
    // Save the currently focused element to return focus later
    this.previousActiveElement = document.activeElement as HTMLElement;
    // Using native HTML dialog API to show the modal
    this.dialog()?.nativeElement.showModal();
    // Focus first input after modal opens
    setTimeout(() => {
      this.firstInput()?.nativeElement.focus();
    }, 0);
  }

  closeModal() {
    // Reset form when closing so it's clean next time it opens
    this.characterForm.reset();
    this.dialog()?.nativeElement.close();
    // Return focus to the element that opened the modal
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
    this.close.emit();
  }

  onCancel() {
    this.closeModal();
  }
}
