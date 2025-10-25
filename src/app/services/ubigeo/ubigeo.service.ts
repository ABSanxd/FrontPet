import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

type RawUbigeos = Record<string, any>; // top-level: { "AMAZONAS": { "BAGUA": { "ARAMANGO": {...}, ... }, ... }, ... }

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private url = '/api-ubigeos/ubigeos.json';
  private cache$?: Observable<RawUbigeos>;

  constructor(private http: HttpClient) { }

  private fetchAll(): Observable<RawUbigeos> {
    if (!this.cache$) {
      this.cache$ = this.http.get<RawUbigeos>(this.url).pipe(
        // normalizamos y cacheamos la respuesta completa
        map(res => (res && typeof res === 'object') ? res : {}),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  // devuelve lista ordenada de departamentos (claves del objeto)
  getDepartments(): Observable<string[]> {
    return this.fetchAll().pipe(
      map(obj => Object.keys(obj || {}).sort((a, b) => a.localeCompare(b, 'es')))
    );
  }

  // devuelve provincias (claves) para un departamento dado
  getProvinces(department: string): Observable<string[]> {
    return this.fetchAll().pipe(
      map(obj => {
        const depObj = obj?.[department] ?? {};
        return Object.keys(depObj).sort((a, b) => a.localeCompare(b, 'es'));
      })
    );
  }

  // devuelve distritos (claves) para department + provincia jijij
  getDistricts(department: string, province: string): Observable<string[]> {
    return this.fetchAll().pipe(
      map(obj => {
        const provObj = obj?.[department]?.[province] ?? {};
        return Object.keys(provObj).sort((a, b) => a.localeCompare(b, 'es'));
      })
    );
  }

}
