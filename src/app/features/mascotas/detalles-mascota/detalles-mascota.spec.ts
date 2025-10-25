import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMascota } from './detalles-mascota';

describe('DetallesMascota', () => {
  let component: DetallesMascota;
  let fixture: ComponentFixture<DetallesMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesMascota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesMascota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
