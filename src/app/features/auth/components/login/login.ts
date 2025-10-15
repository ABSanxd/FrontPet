import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.addEventListener('hidden.bs.modal', () => this.clearForm());
      }
    }
  }

  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.closeModal();
        this.clearForm();
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
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
    this.email = '';
    this.password = '';
    this.error = '';
  }

  private closeModal() {
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
