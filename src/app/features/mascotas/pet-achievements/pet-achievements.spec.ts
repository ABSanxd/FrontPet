import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAchievements } from './pet-achievements';

describe('PetAchievements', () => {
  let component: PetAchievements;
  let fixture: ComponentFixture<PetAchievements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetAchievements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetAchievements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
