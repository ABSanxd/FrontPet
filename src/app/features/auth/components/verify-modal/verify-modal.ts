import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-verify-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-modal.html',
  styleUrl: './verify-modal.css'
})
export class VerifyModal implements AfterViewInit {
  @Input() email!: string;
  @Output() verified = new EventEmitter<void>();

  @ViewChild('verifyModal') modalEl!: ElementRef<HTMLDivElement>;

  verifyForm: FormGroup;
  message = '';
  error = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngAfterViewInit() {
    if (this.modalEl) {
      const el = this.modalEl.nativeElement;
      el.addEventListener('hidden.bs.modal', () => this.clearForm());
    }
  }

  get f() {
    return this.verifyForm.controls;
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;

    this.isLoading = true;
    this.error = '';
    this.message = '';

    const code = this.verifyForm.value.code;
    this.authService.verifyCode(this.email, code).subscribe({
      next: () => {
        this.message = 'Correo verificado correctamente';
        this.isLoading = false;
        setTimeout(() => {
          this.closeModal();
          this.verified.emit();
        }, 1000);
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error?.message || 'Código inválido o expirado.';
      }
    });
  }

  resendCode() {
    this.authService.resendCode(this.email).subscribe({
      next: () => this.message = 'Nuevo código enviado',
      error: () => this.error = 'Error al reenviar código'
    });
  }

  clearForm() {
    this.verifyForm.reset();
    this.error = '';
    this.message = '';
    this.isLoading = false;
  }

  closeModal() {
    if (this.modalEl) {
      const el = this.modalEl.nativeElement;
      el.classList.remove('show');
      el.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      this.clearForm();
    }
  }
}
