import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpDetailsComponent } from './ip-details.component';

describe('IpDetailsComponent', () => {
  let component: IpDetailsComponent;
  let fixture: ComponentFixture<IpDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IpDetailsComponent]
    });
    fixture = TestBed.createComponent(IpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
