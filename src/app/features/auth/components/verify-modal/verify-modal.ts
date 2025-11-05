import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-verify-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-modal.html',
  styleUrl: './verify-modal.css'
})
export class VerifyModal {
  @Input() email!: string; // viene del register
  @Output() verified = new EventEmitter<void>();

  verifyForm: FormGroup;
  message = '';
  isLoading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  get f() {
    return this.verifyForm.controls;
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;
    this.isLoading = true;

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

  closeModal() {
    const modalEl = document.getElementById('verifyModal');
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }
}
