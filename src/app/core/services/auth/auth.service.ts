import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { LoginResponse } from "../../../models/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private http: HttpClient) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(email: string, password: string) {
    return this.http.post<{ status: string, data: LoginResponse }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (this.isBrowser() && res.data) {
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

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  getUser(): { id: string; name: string; email: string } | null {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
