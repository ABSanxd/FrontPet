import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBannerAd } from './side-banner-ad';

describe('SideBannerAd', () => {
  let component: SideBannerAd;
  let fixture: ComponentFixture<SideBannerAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBannerAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBannerAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
