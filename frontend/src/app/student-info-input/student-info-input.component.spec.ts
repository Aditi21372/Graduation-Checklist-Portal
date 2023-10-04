import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StudentInfoInputComponent } from "./student-info-input.component";

describe("StudentInfoInputComponent", () => {
  let component: StudentInfoInputComponent;
  let fixture: ComponentFixture<StudentInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentInfoInputComponent],
    });
    fixture = TestBed.createComponent(StudentInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
