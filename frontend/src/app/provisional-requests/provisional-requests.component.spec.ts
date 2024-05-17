import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalRequestsComponent } from './provisional-requests.component';

describe('ProvisionalRequestsComponent', () => {
  let component: ProvisionalRequestsComponent;
  let fixture: ComponentFixture<ProvisionalRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvisionalRequestsComponent]
    });
    fixture = TestBed.createComponent(ProvisionalRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
