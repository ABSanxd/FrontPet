import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private baseUrl = 'http://localhost:8080/api/v1/notifications';

  constructor(private http: HttpClient) { }

  getMyNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mine`);
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/read`, {});
  }
}