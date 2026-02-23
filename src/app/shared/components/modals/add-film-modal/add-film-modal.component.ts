import { Component, ElementRef, viewChild, output, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-film-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-film-modal.component.html',
})
export class AddFilmModalComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  // Reference to the HTML dialog element
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');

  close = output<void>();
  submit = output<void>();

  private previousActiveElement: HTMLElement | null = null;

  // Form setup for film data
  filmForm: FormGroup = this.fb.group({
    title: [''],
    director: [''],
    producer: [''],
    releaseDate: [''],
    description: ['']
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
    // Clear form data when closing
    this.filmForm.reset();
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
