import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Login } from '../../../features/auth/components/login/login';
import { Register } from '../../../features/auth/components/register/register';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificacionesService } from '../../../services/notificaciones/notificaciones.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Login, Register, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  unreadCount = 0;

  constructor(
    public auth: AuthService,
    private router: Router,
    private notifService: NotificacionesService
  ) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.loadUnread();

      // cuando se lea una notif
      this.notifService.refresh$.subscribe(() => {
        this.loadUnread();
      });

      // cuando llegue una nueva notif (real-time)
      this.notifService.newNotification$.subscribe(() => {
        this.loadUnread();
      });
    }
  }


  loadUnread() {
    this.notifService.getMyNotifications().subscribe(res => {
      this.unreadCount = res.filter(n => n.status === 'ENVIADO').length;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']).then(() => {
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(e => e.remove());
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    });
  }

  getUserInitial(): string {
    const user = this.auth.getUser();
    return user ? user.name.charAt(0).toUpperCase() : '';
  }
}