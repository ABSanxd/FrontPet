import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  step: 'email' | 'code' = 'email';
  form: FormGroup;
  isLoading = false;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [Validators.minLength(8)]]
    });
  }

  sendCode() {
    if (this.form.get('email')?.invalid) return;
    this.isLoading = true;
    this.auth.forgotPassword(this.form.value.email).subscribe({
      next: res => {
        this.isLoading = false;
        this.message = res.data || 'Código enviado al correo.';
        this.step = 'code';
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error?.message || 'No se pudo enviar el código.';
      }
    });
  }

  resetPassword() {
    const { email, code, newPassword } = this.form.value;
    if (!code || !newPassword) return;
    this.isLoading = true;
    this.auth.resetPassword(email, code, newPassword).subscribe({
      next: res => {
        this.isLoading = false;
        this.message = res.data || 'Contraseña restablecida correctamente.';
        this.error = '';
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error?.message || 'Código inválido o expirado.';
      }
    });
  }
}