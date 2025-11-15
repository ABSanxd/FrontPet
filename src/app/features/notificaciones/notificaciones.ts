import { Component } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { CommonModule } from '@angular/common';
import { NotificationResponse } from '../../models/notification';
import { RouterLink } from '@angular/router';
import { Status } from '../../models/enums/status.enum';

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule, RouterLink],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class Notificaciones {
  loading = true;
  notifs: NotificationResponse[] = [];
  error: string | null = null;

  constructor(private notificationsService: NotificacionesService) { }

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
}