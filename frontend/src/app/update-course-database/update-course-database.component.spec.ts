import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCourseDatabaseComponent } from './update-course-database.component';

describe('UpdateCourseDatabaseComponent', () => {
  let component: UpdateCourseDatabaseComponent;
  let fixture: ComponentFixture<UpdateCourseDatabaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCourseDatabaseComponent]
    });
    fixture = TestBed.createComponent(UpdateCourseDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
