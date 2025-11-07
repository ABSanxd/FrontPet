import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarVacuna } from './registrar-vacuna';

describe('RegistrarVacuna', () => {
  let component: RegistrarVacuna;
  let fixture: ComponentFixture<RegistrarVacuna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarVacuna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarVacuna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
