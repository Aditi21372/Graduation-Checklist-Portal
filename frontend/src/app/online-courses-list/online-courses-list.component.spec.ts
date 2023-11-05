import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineCoursesListComponent } from './online-courses-list.component';

describe('OnlineCoursesListComponent', () => {
  let component: OnlineCoursesListComponent;
  let fixture: ComponentFixture<OnlineCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineCoursesListComponent]
    });
    fixture = TestBed.createComponent(OnlineCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
