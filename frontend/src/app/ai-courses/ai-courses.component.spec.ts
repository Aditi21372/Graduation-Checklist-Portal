import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCoursesComponent } from './ai-courses.component';

describe('AiCoursesComponent', () => {
  let component: AiCoursesComponent;
  let fixture: ComponentFixture<AiCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiCoursesComponent]
    });
    fixture = TestBed.createComponent(AiCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
