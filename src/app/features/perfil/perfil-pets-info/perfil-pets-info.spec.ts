import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPetsInfo } from './perfil-pets-info';

describe('PerfilPetsInfo', () => {
  let component: PerfilPetsInfo;
  let fixture: ComponentFixture<PerfilPetsInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPetsInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPetsInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
