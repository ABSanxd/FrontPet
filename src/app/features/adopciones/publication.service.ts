import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<ApiResponse<Publication[]>>(`${this.apiUrl}?view=available`);
  }

  // Ahora obtiene solo las publicaciones del usuario (para "Mis Publicaciones")
  getAllPublications(): Observable<ApiResponse<Publication[]>> {
    // Usamos el parámetro ?view=mine que definimos en el backend
    return this.http.get<ApiResponse<Publication[]>>(`${this.apiUrl}?view=mine`);
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

  // Da Like o Unlike a una publicación
  toggleLike(id: string): Observable<ApiResponse<Publication>> {
    // Aseguramos que se use PATCH
    return this.http.patch<ApiResponse<Publication>>(`${this.apiUrl}/${id}/like`, {});
  }

  // Compartir una publicación
  sharePublication(id: string): Observable<ApiResponse<Publication>> {
    return this.http.patch<ApiResponse<Publication>>(`${this.apiUrl}/${id}/share`, {});
  }
}