import { Component } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { CommonModule } from '@angular/common';
import { NotificationResponse } from '../../models/notification';
import { Status } from '../../models/enums/status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class Notificaciones {
  loading = true;
  notifs: NotificationResponse[] = [];
  error: string | null = null;


  constructor(
    private notificationsService: NotificacionesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadNotifications();

    // cuando llegue una notificaciòn real-time
    this.notificationsService.newNotification$.subscribe((notif: NotificationResponse) => {
      this.notifs.unshift(notif);
    });

    // cuando se cambie el estado (leída)
    this.notificationsService.refresh$.subscribe(() => {
      this.loadNotifications();
    });
  }

  loadNotifications() {
    this.notificationsService.getMyNotifications()
      .subscribe({
        next: (res) => {
          this.notifs = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar las notificaciones.';
          this.loading = false;
        }
      });
  }



  marcarComoLeida(id: string) {
    this.notificationsService.markAsRead(id).subscribe(() => {
      this.notifs = this.notifs.map(n =>
        n.id === id ? { ...n, status: Status.LEIDO } : n
      );
    });
  }

  openNotification(item: NotificationResponse) {
    // Marcar como leída
    if (item.status === Status.ENVIADO) {
      this.notificationsService.markAsRead(item.id).subscribe(() => {
        item.status = Status.LEIDO;
      });
    }

    if (!item.actionUrl) return; // si no hay URL, no hacemos nada

    const path = item.actionUrl.trim(); // quitamos espacios

    if (path.startsWith('http')) {
      // URL externa
      window.location.href = path;
    } else {
      // Ruta interna SPA
      let internalPath = path.startsWith('/') ? path : '/' + path;
      console.log('Intentando navegar a:', internalPath);
      this.router.navigateByUrl(internalPath)
        .then(success => {
          if (!success) console.warn('No se pudo navegar a', internalPath);
        });
    }
  }

}