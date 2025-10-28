import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilInfoCard } from './perfil-info-card';

describe('PerfilInfoCard', () => {
  let component: PerfilInfoCard;
  let fixture: ComponentFixture<PerfilInfoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilInfoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilInfoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
