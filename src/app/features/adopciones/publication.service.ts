import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { 
  Publication, 
  CreatePublicationDTO, 
  UpdatePublicationDTO, 
  ApiResponse 
} from '../../models/publication';
import { Status } from '../../models/enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private apiUrl = 'http://localhost:8080/publications';

  constructor(private http: HttpClient) { }

  // Obtiene las publicaciones disponibles para adoptar (las de otros usuarios)
  getAvailablePublications(): Observable<ApiResponse<Publication[]>> {
    console.log('Servicio: Llamando a', `${this.apiUrl}?view=available`);
    return this.http.get<ApiResponse<Publication[]>>(`${this.apiUrl}?view=available`).pipe(
      tap(response => {
        console.log('Servicio: Respuesta de "available" recibida', response);
      }),
      catchError(error => {
        console.error('Servicio: Error en "available"', error);
        throw error;
      })
    );
  }

  // Ahora obtiene solo las publicaciones del usuario (para "Mis Publicaciones")
  getAllPublications(): Observable<ApiResponse<Publication[]>> {
    console.log('Servicio: Llamando a', `${this.apiUrl}?view=mine`);
    // Usamos el parámetro ?view=mine que definimos en el backend
    return this.http.get<ApiResponse<Publication[]>>(`${this.apiUrl}?view=mine`).pipe(
      tap(response => {
        console.log('Servicio: Respuesta de "mine" recibida', response);
      }),
      catchError(error => {
        console.error('Servicio: Error en "mine"', error);
        throw error;
      })
    );
  }

  // Obtener una publicación por ID
  getPublicationById(id: string): Observable<ApiResponse<Publication>> {
    return this.http.get<ApiResponse<Publication>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva publicación
  createPublication(dto: CreatePublicationDTO): Observable<ApiResponse<Publication>> {
    return this.http.post<ApiResponse<Publication>>(this.apiUrl, dto);
  }

  // Actualizar una publicación
  updatePublication(id: string, dto: UpdatePublicationDTO): Observable<ApiResponse<Publication>> {
    return this.http.put<ApiResponse<Publication>>(`${this.apiUrl}/${id}`, dto);
  }

  // Eliminar una publicación
  deletePublication(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Cambiar estado de una publicación
  changeStatus(id: string, status: Status): Observable<ApiResponse<Publication>> {
    return this.updatePublication(id, { status });
  }

  // --- INICIO DE CAMBIOS ---

  // Da Like o Unlike a una publicación
  toggleLike(id: string): Observable<ApiResponse<Publication>> {
    return this.http.patch<ApiResponse<Publication>>(`${this.apiUrl}/${id}/like`, {});
  }

  // Compartir una publicación
  sharePublication(id: string): Observable<ApiResponse<Publication>> {
    return this.http.patch<ApiResponse<Publication>>(`${this.apiUrl}/${id}/share`, {});
  }
  // --- FIN DE CAMBIOS ---
}