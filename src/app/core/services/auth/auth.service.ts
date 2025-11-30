import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { LoginResponse } from "../../../models/auth";
import { isPlatformBrowser } from "@angular/common";
import { UserCreateDTO, UserResponseDTO } from "../../../models/user";
import { Observable } from "rxjs";
import { api_url } from "../../apiUrl"; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = api_url + '/api/v1/auth';
  private tokenKey = 'token';
  private userKey = 'user';

  public isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(email: string, password: string) {
    return this.http.post<{ status: string, data: LoginResponse }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (this.isBrowser && res.data) {
          localStorage.setItem(this.tokenKey, res.data.token);
          localStorage.setItem(this.userKey, JSON.stringify({
            id: res.data.userId,
            name: res.data.name,
            email: res.data.email
          }));
        }
      }),
      map(res => res.data)
    );
  }

  register(user: UserCreateDTO): Observable<UserResponseDTO> {
    return this.http
      .post<{ status: string, data: UserResponseDTO }>(
        `${this.apiUrl}/register`,
        user
      )
      .pipe(map(res => res.data));
  }

  // Verificar código (email + code)
  verifyCode(email: string, code: string): Observable<any> {
    const params = new HttpParams().set('email', email).set('code', code);
    return this.http.post<{ status: string, data: any }>(`${this.apiUrl}/verify-code`, null, { params })
      .pipe(map(res => res));
  }

  // Reenviar código de verificación
  resendCode(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post<{ status: string, data: any }>(`${this.apiUrl}/resend-code`, null, { params })
      .pipe(map(res => res));
  }

  // Solicitar código para recuperar contraseña
  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post<{ status: string, data: any }>(`${this.apiUrl}/forgot-password`, null, { params })
      .pipe(map(res => res));
  }

  // Restablecer contraseña
  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('code', code)
      .set('newPassword', newPassword);
    return this.http.post<{ status: string, data: any }>(`${this.apiUrl}/reset-password`, null, { params })
      .pipe(map(res => res));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  getUser(): { id: string; name: string; email: string } | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}