import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PetChallengeResponseDTO } from '../../models/pet-challenge';
import { Category } from '../../models/enums/category.enum';
import { Frequency } from '../../models/enums/frequency.enum';
import { Status } from '../../models/enums/status.enum';
import { ApiResponse } from '../../models/api-response';
import { ChallengeResponseDTO } from '../../models/challenge';
@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
    private apiUrl = 'http://localhost:8080/api/v1/challenges'; 

    constructor(private http: HttpClient) {}

    getAllChallenges(
    category?: Category,
    frequency?: Frequency
  ): Observable<ChallengeResponseDTO[]> {
    let params = new HttpParams();
    
    if (category) {
      params = params.set('category', category);
    }
    
    if (frequency) {
      params = params.set('frequency', frequency);
    }

    return this.http
      .get<ApiResponse<ChallengeResponseDTO[]>>(this.apiUrl, { params })
      .pipe(map(response => response.data));
  }

  getChallengeById(id: string): Observable<ChallengeResponseDTO> {
    return this.http
      .get<ApiResponse<ChallengeResponseDTO>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  getActiveChallenges(
    category?: Category,
    frequency?: Frequency
  ): Observable<ChallengeResponseDTO[]> {
    return this.getAllChallenges(category, frequency).pipe(
      map(challenges => challenges.filter(c => c.status === Status.ACTIVO))
    );
  }

    
  
}
