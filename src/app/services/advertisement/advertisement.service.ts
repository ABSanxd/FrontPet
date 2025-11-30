import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { AdvertisementResponseDTO } from '../../models/advertisement';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { api_url } from '../../core/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private apiUrl = api_url + '/api/v1/advertisements';

  constructor(private http: HttpClient) {}

  // Obtener publicidades por zona
  getByZone(zone: ZoneAd): Observable<AdvertisementResponseDTO[]> {
    return this.http
      .get<{ status: string; data: AdvertisementResponseDTO[] }>(`${this.apiUrl}/zone/${zone}`)
      .pipe(map((res) => res.data));
  }
  
}
