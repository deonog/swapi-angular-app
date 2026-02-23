import { Component, ElementRef, viewChild, output, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-planet-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-planet-modal.component.html',
})
export class AddPlanetModalComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  // Dialog element reference for modal control
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');

  close = output<void>();
  submit = output<void>();

  private previousActiveElement: HTMLElement | null = null;

  // Planet form with all the required fields
  planetForm: FormGroup = this.fb.group({
    name: [''],
    type: [''],
    createdBy: [''],
    genre: [''],
    races: ['']
  });

  ngAfterViewInit() {
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
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.dialog()?.nativeElement.showModal();
    setTimeout(() => {
      this.firstInput()?.nativeElement.focus();
    }, 0);
  }

  closeModal() {
    // Reset form on close
    this.planetForm.reset();
    this.dialog()?.nativeElement.close();
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
    this.close.emit();
  }

  onCancel() {
    this.closeModal();
  }
}
