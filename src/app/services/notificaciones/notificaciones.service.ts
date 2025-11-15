import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject, map, tap } from 'rxjs';
import { NotificationResponse } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private baseUrl = 'http://localhost:8080/api/v1/notifications';
  public refresh$ = new Subject<void>();
  public newNotification$ = new Subject<NotificationResponse>(); // 👈 agregado

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    // Solo se ejecuta en el navegador, no en SSR
    if (isPlatformBrowser(this.platformId)) {
      this.connectToStream();
    }
  }

  getMyNotifications(): Observable<NotificationResponse[]> {
    return this.http
      .get<{ status: string, data: NotificationResponse[] }>(`${this.baseUrl}/mine`)
      .pipe(map(res => res.data));
  }

  markAsRead(id: string) {
    return this.http
      .put<{ status: string, data: NotificationResponse }>(`${this.baseUrl}/${id}/read`, {})
      .pipe(
        map(res => res.data),
        tap(() => this.refresh$.next())
      );
  }

  private connectToStream() {
    const token = localStorage.getItem("token");
    const source = new EventSource(`${this.baseUrl}/stream?token=${token}`);

    source.onmessage = (event) => {
      console.log("Nueva notificación SSE:", event.data);

      const notif: NotificationResponse = JSON.parse(event.data);
      this.newNotification$.next(notif);  // 👈 ahora sí existe

      this.refresh$.next(); // opcional
    };

    source.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
