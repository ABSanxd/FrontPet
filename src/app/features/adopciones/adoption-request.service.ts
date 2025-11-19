import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, AdoptionRequest, AdoptionRequestCreateDTO } from '../../models/publication';

@Injectable({
  providedIn: 'root'
})
export class AdoptionRequestService {

  // El endpoint que creamos en el backend (Paso 4)
  private apiUrl = 'http://localhost:8080/api/v1/adoption-requests';

  constructor(private http: HttpClient) { }

  //Envía una nueva solicitud de adopción al backend.
  createRequest(dto: AdoptionRequestCreateDTO): Observable<ApiResponse<AdoptionRequest>> {
    return this.http.post<ApiResponse<AdoptionRequest>>(this.apiUrl, dto);
  }



   //Obtiene las solicitudes que el usuario actual ha ENVIADO.

  getSentRequests(): Observable<AdoptionRequest[]> {
    return this.http.get<ApiResponse<AdoptionRequest[]>>(`${this.apiUrl}/sent`)
      .pipe(map(res => res.data || []));
  }

  
   //Obtiene las solicitudes que el usuario actual ha RECIBIDO.

  getReceivedRequests(): Observable<AdoptionRequest[]> {
    return this.http.get<ApiResponse<AdoptionRequest[]>>(`${this.apiUrl}/received`)
      .pipe(map(res => res.data || []));
  }

  
   //Acepta una solicitud (el dueño de la publicación).

  acceptRequest(requestId: string): Observable<ApiResponse<AdoptionRequest>> {
    return this.http.patch<ApiResponse<AdoptionRequest>>(`${this.apiUrl}/${requestId}/accept`, {});
  }

  
   //Rechaza una solicitud (el dueño de la publicación).
  rejectRequest(requestId: string): Observable<ApiResponse<AdoptionRequest>> {
    return this.http.patch<ApiResponse<AdoptionRequest>>(`${this.apiUrl}/${requestId}/reject`, {});
  }


   //Cancela una solicitud (el solicitante).

  cancelRequest(requestId: string): Observable<ApiResponse<AdoptionRequest>> {
    return this.http.patch<ApiResponse<AdoptionRequest>>(`${this.apiUrl}/${requestId}/cancel`, {});
  }
}