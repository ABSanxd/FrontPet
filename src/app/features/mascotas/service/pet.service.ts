// src/app/features/mascotas/pet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pet, PetCreateRequest, PetUpdateRequest } from '../../../models/pet';
import { ApiResponse } from '../../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:8080/api/v1/pets';
  private storageApiUrl = 'http://localhost:8080/api/v1/storage';

  constructor(private http: HttpClient) { }

  getAllPetsByUser(): Observable<Pet[]> {
   
    return this.http.get<ApiResponse<Pet[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }


  getPetById(id: string): Observable<Pet> {
   
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createPet(pet: PetCreateRequest): Observable<Pet> {
    return this.http.post<ApiResponse<Pet>>(this.apiUrl, pet)
      .pipe(map(response => response.data));
  }

  // PUT /api/v1/pets/{id} 
  updatePet(id: string, pet: PetUpdateRequest): Observable<Pet> {
    // Quitamos { headers }
    return this.http.put<ApiResponse<Pet>>(`${this.apiUrl}/${id}`, pet)
      .pipe(map(response => response.data));
  }

  // DELETE /api/v1/pets/{id} 
  deletePet(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  // GET /api/v1/pets/count
  countActivePets(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/count`)
      .pipe(map(response => response.data));
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file); 

    return this.http.post<ApiResponse<{url: string}>>(`${this.storageApiUrl}/upload`, formData)
      .pipe(
        map(response => response.data.url) 
      );
  }
}