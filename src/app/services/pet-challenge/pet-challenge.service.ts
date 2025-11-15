import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { PetChallengeResponseDTO, PetChallengeCreateDTO  } from '../../models/pet-challenge';
import { ApiResponse } from '../../models/api-response';


@Injectable({
  providedIn: 'root'
})
export class PetChallengeService {
    private apiUrl = 'http://localhost:8080/api/v1'; 

    constructor(private http: HttpClient) {}

     completeChallenge(
    petId: string, 
    challengeId: string
  ): Observable<PetChallengeResponseDTO> {
    const payload: PetChallengeCreateDTO = { challengeId };
    
    return this.http
      .post<ApiResponse<PetChallengeResponseDTO>>(
        `${this.apiUrl}/pets/${petId}/challenges`,
        payload
      )
      .pipe(map(response => response.data));
  }

  getPetChallengeHistory(petId: string): Observable<PetChallengeResponseDTO[]> {
    return this.http
      .get<ApiResponse<PetChallengeResponseDTO[]>>(
        `${this.apiUrl}/pets/${petId}/challenges`
      )
      .pipe(map(response => response.data));
  }

 getPetChallengesToday(petId: string): Observable<PetChallengeResponseDTO[]> {
    return this.http
      .get<ApiResponse<PetChallengeResponseDTO[]>>(
        `${this.apiUrl}/pets/${petId}/challenges/today`
      )
      .pipe(map(response => response.data));
  }
 getPetChallengesThisWeek(petId: string): Observable<PetChallengeResponseDTO[]> {
    return this.http
      .get<ApiResponse<PetChallengeResponseDTO[]>>(
        `${this.apiUrl}/pets/${petId}/challenges/week`
      )
      .pipe(map(response => response.data));
  }
}
