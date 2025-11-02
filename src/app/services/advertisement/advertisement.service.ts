import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { AdvertisementResponseDTO } from '../../models/advertisement';
import { ZoneAd } from '../../models/enums/zoneAd.enum';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private apiUrl = 'http://localhost:8080/api/v1/advertisements';

  constructor(private http: HttpClient) {}

  // Obtener publicidades por zona
  getByZone(zone: ZoneAd): Observable<AdvertisementResponseDTO[]> {
    return this.http
      .get<{ status: string; data: AdvertisementResponseDTO[] }>(`${this.apiUrl}/zone/${zone}`)
      .pipe(map((res) => res.data));
  }
  
}
