import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDeleteModal } from './perfil-delete-modal';

describe('PerfilDeleteModal', () => {
  let component: PerfilDeleteModal;
  let fixture: ComponentFixture<PerfilDeleteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDeleteModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilDeleteModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
