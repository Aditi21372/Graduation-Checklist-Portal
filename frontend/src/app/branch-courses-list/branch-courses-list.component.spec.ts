import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCoursesListComponent } from './branch-courses-list.component';

describe('BranchCoursesListComponent', () => {
  let component: BranchCoursesListComponent;
  let fixture: ComponentFixture<BranchCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchCoursesListComponent]
    });
    fixture = TestBed.createComponent(BranchCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
