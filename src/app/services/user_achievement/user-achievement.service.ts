import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserAchievementDTO } from '../../models/user-achievement';
import { ApiResponse } from '../../models/api-response';
import { api_url } from '../../core/apiUrl'; 

@Injectable({
  providedIn: 'root',
})
export class UserAchievementService {
  private readonly apiUrl = api_url + '/api/v1/users';
  constructor(private http: HttpClient) {}

  // Obtener logros de usuario por ID
  getUserAchievements(userId: string): Observable<UserAchievementDTO[]> {
    return this.http
      .get<ApiResponse<UserAchievementDTO[]>>(`${this.apiUrl}/${userId}/achievements`)
      .pipe(map((response) => response.data));
  }

  //contar logros de usuario
  countUserAchievements(userId: string): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/${userId}/achievements/count`)
      .pipe(map((response) => response.data));
  }
}
