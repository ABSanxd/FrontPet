import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMascota } from './registrar-mascota';

describe('RegistrarMascota', () => {
  let component: RegistrarMascota;
  let fixture: ComponentFixture<RegistrarMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarMascota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarMascota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
