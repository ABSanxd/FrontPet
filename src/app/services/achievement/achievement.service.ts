import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AchievementProgressDTO, PetAchievementResponseDTO } from '../../models/achievement';
import { ApiResponse } from '../../models/api-response';
import { api_url } from '../../core/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private readonly apiUrl = api_url + '/api/v1/pets';

  constructor(private http: HttpClient) {}

  //Obtener logros completados de una mascota
  getCompletedAchievements(petId: string): Observable<PetAchievementResponseDTO[]> {
    return this.http
      .get<ApiResponse<PetAchievementResponseDTO[]>>(
        `${this.apiUrl}/${petId}/achievements/completed`
      )
      .pipe(map((response) => response.data));
  }

  //Obtener logros en progreso de una mascota
  getInProgressAchievements(petId: string): Observable<PetAchievementResponseDTO[]> {
    return this.http
      .get<ApiResponse<PetAchievementResponseDTO[]>>(
        `${this.apiUrl}/${petId}/achievements/in-progress`
      )
      .pipe(map((response) => response.data));
  }

  // Obtener progreso detallado de un logro específico
  getAchievementProgress(petId: string, achievementId: string): Observable<AchievementProgressDTO> {
    return this.http
      .get<ApiResponse<AchievementProgressDTO>>(
        `${this.apiUrl}/${petId}/achievements/${achievementId}/progress`
      )
      .pipe(map((response) => response.data));
  }

  //Obtener progreso de TODOS los logros disponibles
  getAllAchievementsProgress(petId: string): Observable<AchievementProgressDTO[]> {
    return this.http
      .get<ApiResponse<AchievementProgressDTO[]>>(`${this.apiUrl}/${petId}/achievements/progress`)
      .pipe(map((response) => response.data));
  }

  //Contar logros completados
  countCompletedAchievements(petId: string): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.apiUrl}/${petId}/achievements/count`)
      .pipe(map((response) => response.data));
  }
}
