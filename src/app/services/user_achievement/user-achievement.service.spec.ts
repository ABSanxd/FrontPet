import { TestBed } from '@angular/core/testing';

import { UserAchievementService } from './user-achievement.service';

describe('UserAchievementService', () => {
  let service: UserAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
