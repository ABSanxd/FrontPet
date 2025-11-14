import { Component } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class Notificaciones {
  loading = true;
  notifs: any[] = [];
  error: string | null = null;

  constructor(private notificationsService: NotificacionesService) { }

  ngOnInit() {
    this.notificationsService.getMyNotifications()
      .subscribe({
        next: (res) => {
          this.notifs = res.data;
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
        n.id === id ? { ...n, status: 'LEIDO' } : n
      );
    });
  }
}
