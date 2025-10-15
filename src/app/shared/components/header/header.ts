import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../../../features/auth/components/login/login';
import { Register } from '../../../features/auth/components/register/register';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Login, Register],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(public auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']); // vuelve al landing
  }

  getUserInitial(): string {
    const user = this.auth.getUser();
    return user ? user.name.charAt(0).toUpperCase() : '';
  }
}
