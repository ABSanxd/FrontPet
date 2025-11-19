import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terminos } from './terminos';

describe('Terminos', () => {
  let component: Terminos;
  let fixture: ComponentFixture<Terminos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Terminos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Terminos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
