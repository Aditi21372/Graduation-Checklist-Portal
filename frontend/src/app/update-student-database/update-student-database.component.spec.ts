import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentDatabaseComponent } from './update-student-database.component';

describe('UpdateStudentDatabaseComponent', () => {
  let component: UpdateStudentDatabaseComponent;
  let fixture: ComponentFixture<UpdateStudentDatabaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStudentDatabaseComponent]
    });
    fixture = TestBed.createComponent(UpdateStudentDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
