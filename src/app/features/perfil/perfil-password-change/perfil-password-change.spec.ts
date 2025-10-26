import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPasswordChange } from './perfil-password-change';

describe('PerfilPasswordChange', () => {
  let component: PerfilPasswordChange;
  let fixture: ComponentFixture<PerfilPasswordChange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPasswordChange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPasswordChange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
