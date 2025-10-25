import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserCreateDTO, UserResponseDTO, UserUpdateDTO } from '../../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }

  // Crear usuario (register)
  createUser(user: UserCreateDTO): Observable<UserResponseDTO> {
    return this.http.post<{ status: string, data: UserResponseDTO }>(this.apiUrl, user)
      .pipe(
        map(res => res.data)
      );
  }

  // Obtener todos los usuarios
  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<{ status: string, data: UserResponseDTO[] }>(this.apiUrl)
      .pipe(map(res => res.data));
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<UserResponseDTO> {
    return this.http.get<{ status: string, data: UserResponseDTO }>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  // Actualizar usuario
  updateUser(id: string, user: UserUpdateDTO): Observable<UserResponseDTO> {
    return this.http.patch<{ status: string, data: UserResponseDTO }>(`${this.apiUrl}/${id}`, user)
      .pipe(map(res => res.data));
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<void> {
    return this.http.delete<{ status: string, data: null }>(`${this.apiUrl}/${id}`)
      .pipe(map(() => { }));
  }
}
