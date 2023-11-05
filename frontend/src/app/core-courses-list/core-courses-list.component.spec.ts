import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreCoursesListComponent } from './core-courses-list.component';

describe('CoreCoursesListComponent', () => {
  let component: CoreCoursesListComponent;
  let fixture: ComponentFixture<CoreCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoreCoursesListComponent]
    });
    fixture = TestBed.createComponent(CoreCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
