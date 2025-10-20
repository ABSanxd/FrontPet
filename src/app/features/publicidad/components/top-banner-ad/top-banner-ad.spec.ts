import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBannerAd } from './top-banner-ad';

describe('TopBannerAd', () => {
  let component: TopBannerAd;
  let fixture: ComponentFixture<TopBannerAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBannerAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBannerAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
