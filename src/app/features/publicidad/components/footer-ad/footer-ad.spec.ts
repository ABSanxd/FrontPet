import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAd } from './footer-ad';

describe('FooterAd', () => {
  let component: FooterAd;
  let fixture: ComponentFixture<FooterAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
