import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemLeaveComponent } from './sem-leave.component';

describe('SemLeaveComponent', () => {
  let component: SemLeaveComponent;
  let fixture: ComponentFixture<SemLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemLeaveComponent]
    });
    fixture = TestBed.createComponent(SemLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
