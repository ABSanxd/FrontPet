import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetChallenges } from './pet-challenges';

describe('PetChallenges', () => {
  let component: PetChallenges;
  let fixture: ComponentFixture<PetChallenges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetChallenges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetChallenges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
