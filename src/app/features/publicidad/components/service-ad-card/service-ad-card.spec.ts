import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAdCard } from './service-ad-card';

describe('ServiceAdCard', () => {
  let component: ServiceAdCard;
  let fixture: ComponentFixture<ServiceAdCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAdCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAdCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
