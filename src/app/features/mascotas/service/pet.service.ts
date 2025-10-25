// src/app/features/mascotas/pet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pet, PetCreateRequest, PetUpdateRequest } from '../../../models/pet';
import { ApiResponse } from '../../../models/api-response';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:8080/api/v1/pets';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const user = this.authService.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return new HttpHeaders({
      'X-User-Id': user.id
    });
  }

  // GET /api/v1/pets -> Listar mascotas del usuario
  getAllPetsByUser(): Observable<Pet[]> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<Pet[]>>(this.apiUrl, { headers })
      .pipe(map(response => response.data));
  }

  // GET /api/v1/pets/{id} -> Ver detalle de una mascota
  getPetById(id: string): Observable<Pet> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(map(response => response.data));
  }

  // POST /api/v1/pets -> Crear mascota
  createPet(pet: PetCreateRequest): Observable<Pet> {
    const headers = this.getHeaders();
    return this.http.post<ApiResponse<Pet>>(this.apiUrl, pet, { headers })
      .pipe(map(response => response.data));
  }

  // PUT /api/v1/pets/{id} -> Actualizar mascota
  updatePet(id: string, pet: PetUpdateRequest): Observable<Pet> {
    const headers = this.getHeaders();
    return this.http.put<ApiResponse<Pet>>(`${this.apiUrl}/${id}`, pet, { headers })
      .pipe(map(response => response.data));
  }

  // DELETE /api/v1/pets/{id} -> Eliminar mascota (soft delete)
  deletePet(id: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(map(() => undefined));
  }

  // GET /api/v1/pets/count -> Contar mascotas activas
  countActivePets(): Observable<number> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`, { headers })
      .pipe(map(response => response.data));
  }
}