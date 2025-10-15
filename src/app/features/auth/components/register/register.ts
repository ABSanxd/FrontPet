import { AfterViewInit, Component } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserCreateDTO } from '../../../../models/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements AfterViewInit {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }


  ngAfterViewInit() {
    if (this.isBrowser()) {
      const registerModal = document.getElementById('registerModal');
      if (registerModal) {
        registerModal.addEventListener('hidden.bs.modal', () => this.clearForm());
      }
    }
  }

  onSubmit() {
    const newUser: UserCreateDTO = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.closeModal();
        this.clearForm();

        // login automático después de registrarse
        this.authService.login(this.email, this.password).subscribe(() => {
          this.router.navigate(['/inicio']);
        });
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
    this.name = '';
    this.email = '';
    this.password = '';
    this.error = '';
  }

  private closeModal() {
    if (!this.isBrowser()) return;

    const modalEl = document.getElementById('registerModal');
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }
}
