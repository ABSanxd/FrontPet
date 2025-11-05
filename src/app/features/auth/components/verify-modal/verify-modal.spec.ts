import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyModal } from './verify-modal';

describe('VerifyModal', () => {
  let component: VerifyModal;
  let fixture: ComponentFixture<VerifyModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
