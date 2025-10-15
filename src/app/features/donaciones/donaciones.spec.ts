import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donaciones } from './donaciones';

describe('Donaciones', () => {
  let component: Donaciones;
  let fixture: ComponentFixture<Donaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Donaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
