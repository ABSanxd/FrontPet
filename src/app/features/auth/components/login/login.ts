import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, AfterViewInit {

  loginForm!: FormGroup;
  error = '';
  isLoading = false;
  formSubmitted = false; 

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.addEventListener('hidden.bs.modal', () => this.clearForm());
      }
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.formSubmitted = true;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.error = 'Por favor completa los campos correctamente.';
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal();
        this.clearForm();
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.isLoading = false;
        const data = err.error?.data;
        if (data && typeof data === 'object') {
          this.error = String(Object.values(data)[0]);
        } else {
          this.error = err.error?.message || 'Error desconocido';
        }
      }
    });
  }

  clearForm() {
    this.loginForm.reset();
    this.error = '';
    this.formSubmitted = false; 
  }

  closeModal() {
    if (!this.isBrowser()) return;

    const modalEl = document.getElementById('loginModal');
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }
}
