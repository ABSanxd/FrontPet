import { TestBed } from '@angular/core/testing';

import { PetChallengeService } from './pet-challenge.service';

describe('PetChallengeService', () => {
  let service: PetChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
