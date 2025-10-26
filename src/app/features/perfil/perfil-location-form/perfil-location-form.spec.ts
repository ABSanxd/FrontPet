import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilLocationForm } from './perfil-location-form';

describe('PerfilLocationForm', () => {
  let component: PerfilLocationForm;
  let fixture: ComponentFixture<PerfilLocationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilLocationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilLocationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
