import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
// --- IMPORTS ACTUALIZADOS ---
import { PetResponseDTO, PetCreateDTO, PetUpdateDTO } from '../../../models/pet';
import { ApiResponse } from '../../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:8080/api/v1/pets';
  private storageApiUrl = 'http://localhost:8080/api/v1/storage';

  constructor(private http: HttpClient) { }

  // --- TIPO DE RETORNO ACTUALIZADO ---
  getAllPetsByUser(): Observable<PetResponseDTO[]> {
    return this.http.get<ApiResponse<PetResponseDTO[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // --- TIPO DE RETORNO ACTUALIZADO ---
  getPetById(id: string): Observable<PetResponseDTO> {
    return this.http.get<ApiResponse<PetResponseDTO>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // --- FIRMA ACTUALIZADA ---
  createPet(pet: PetCreateDTO): Observable<PetResponseDTO> {
    return this.http.post<ApiResponse<PetResponseDTO>>(this.apiUrl, pet)
      .pipe(map(response => response.data));
  }

  // --- FIRMA ACTUALIZADA ---
  updatePet(id: string, pet: PetUpdateDTO): Observable<PetResponseDTO> {
    return this.http.put<ApiResponse<PetResponseDTO>>(`${this.apiUrl}/${id}`, pet)
      .pipe(map(response => response.data));
  }

  deletePet(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

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