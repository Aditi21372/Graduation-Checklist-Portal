import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwDetailsComponent } from './cw-details.component';

describe('CwDetailsComponent', () => {
  let component: CwDetailsComponent;
  let fixture: ComponentFixture<CwDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CwDetailsComponent]
    });
    fixture = TestBed.createComponent(CwDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
