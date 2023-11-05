import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtpDetailsComponent } from './btp-details.component';

describe('BtpDetailsComponent', () => {
  let component: BtpDetailsComponent;
  let fixture: ComponentFixture<BtpDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtpDetailsComponent]
    });
    fixture = TestBed.createComponent(BtpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
