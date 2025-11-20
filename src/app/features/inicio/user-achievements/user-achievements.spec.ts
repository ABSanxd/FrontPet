import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAchievements } from './user-achievements';

describe('UserAchievements', () => {
  let component: UserAchievements;
  let fixture: ComponentFixture<UserAchievements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAchievements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAchievements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
