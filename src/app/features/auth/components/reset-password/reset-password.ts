import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  sendCode() {
    this.error = '';
    this.message = '';
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
    this.error = '';
    this.message = '';

    const codeControl = this.form.get('code');
    const passwordControl = this.form.get('newPassword');

    // Validaciones antes de enviar
    if (!codeControl?.value || codeControl.invalid) {
      codeControl?.markAsTouched();
      return;
    }
    if (!passwordControl?.value || passwordControl.invalid) {
      passwordControl?.markAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, code, newPassword } = this.form.value;

    this.auth.resetPassword(email, code, newPassword).subscribe({
      next: res => {
        this.isLoading = false;
        this.message = res.data || 'Contraseña restablecida correctamente.';
        this.error = '';
        // Limpiar formulario y redirigir a landing page después de 2s
        setTimeout(() => {
          this.form.reset();
          this.step = 'email';
          this.router.navigate(['/']); 
        }, 2000);
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error?.message || 'Código inválido o expirado.';
      }
    });
  }

  goBack() {
    this.step = 'email';
    this.message = '';
    this.error = '';
    // Limpiar campos del paso 2
    this.form.get('code')?.reset();
    this.form.get('newPassword')?.reset();
  }
}
