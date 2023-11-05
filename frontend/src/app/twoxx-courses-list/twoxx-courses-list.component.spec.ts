import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoxxCoursesListComponent } from './twoxx-courses-list.component';

describe('TwoxxCoursesListComponent', () => {
  let component: TwoxxCoursesListComponent;
  let fixture: ComponentFixture<TwoxxCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoxxCoursesListComponent]
    });
    fixture = TestBed.createComponent(TwoxxCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
