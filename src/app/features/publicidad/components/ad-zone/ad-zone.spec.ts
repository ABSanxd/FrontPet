import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdZone } from './ad-zone';

describe('AdZone', () => {
  let component: AdZone;
  let fixture: ComponentFixture<AdZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
