import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMascotas } from './listar-mascotas';

describe('ListarMascotas', () => {
  let component: ListarMascotas;
  let fixture: ComponentFixture<ListarMascotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarMascotas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMascotas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
