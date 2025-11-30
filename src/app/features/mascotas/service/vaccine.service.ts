import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import {
  VaccineResponseDTO,
  VaccineCreateDTO,
  VaccineDoseDTO,
  VaccineUpdateDTO, 
} from '../../../models/vaccine';
import { api_url } from '../../../core/apiUrl'; 


@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private apiUrl =  api_url + '/api/v1';

  constructor(private http: HttpClient) {}

  // GET /api/v1/pets/{petId}/vaccines
  getVaccines(petId: string): Observable<VaccineResponseDTO[]> {
    return this.http
      .get<ApiResponse<VaccineResponseDTO[]>>(
        `${this.apiUrl}/pets/${petId}/vaccines`
      )
      .pipe(map((response) => response.data));
  }

  // Obtiene una vacuna específica (filtrando en el cliente)
  getVaccineById(
    petId: string,
    vaccineId: string
  ): Observable<VaccineResponseDTO | undefined> {
    return this.getVaccines(petId).pipe(
      map((vaccines) => vaccines.find((v) => v.id === vaccineId))
    );
  }

  // POST /api/v1/pets/{petId}/vaccines
  createVaccine(
    petId: string,
    dto: VaccineCreateDTO
  ): Observable<VaccineResponseDTO> {
    return this.http
      .post<ApiResponse<VaccineResponseDTO>>(
        `${this.apiUrl}/pets/${petId}/vaccines`,
        dto
      )
      .pipe(map((response) => response.data));
  }

  // PUT /api/v1/pets/{petId}/vaccines/{vaccineId}
  updateVaccine(
    petId: string,
    vaccineId: string,
    dto: VaccineUpdateDTO
  ): Observable<VaccineResponseDTO> {
    return this.http
      .put<ApiResponse<VaccineResponseDTO>>(
        `${this.apiUrl}/pets/${petId}/vaccines/${vaccineId}`,
        dto
      )
      .pipe(map((response) => response.data));
  }

  // DELETE /api/v1/pets/{petId}/vaccines/{vaccineId}
  deleteVaccine(petId: string, vaccineId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(
        `${this.apiUrl}/pets/${petId}/vaccines/${vaccineId}`
      )
      .pipe(map(() => undefined));
  }


  // POST /api/v1/vaccines/{vaccineId}/doses
  addDose(
    vaccineId: string,
    doseDto: { applicationDate: string; applied: boolean }
  ): Observable<VaccineDoseDTO> {
    return this.http
      .post<ApiResponse<VaccineDoseDTO>>(
        `${this.apiUrl}/vaccines/${vaccineId}/doses`,
        doseDto
      )
      .pipe(map((response) => response.data));
  }

  // PUT /api/v1/doses/{doseId}/status
  updateDoseStatus(doseId: string, applied: boolean): Observable<VaccineDoseDTO> {
    return this.http
      .put<ApiResponse<VaccineDoseDTO>>(
        `${this.apiUrl}/doses/${doseId}/status`,
        { applied }
      )
      .pipe(map((response) => response.data));
  }

  // DELETE /api/v1/doses/{doseId}
  deleteDose(doseId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/doses/${doseId}`)
      .pipe(map(() => undefined));
  }
}