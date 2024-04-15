import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalCertificateComponent } from './provisional-certificate.component';

describe('ProvisionalCertificateComponent', () => {
  let component: ProvisionalCertificateComponent;
  let fixture: ComponentFixture<ProvisionalCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvisionalCertificateComponent]
    });
    fixture = TestBed.createComponent(ProvisionalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
