import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SshCoursesListComponent } from './ssh-courses-list.component';

describe('SshCoursesListComponent', () => {
  let component: SshCoursesListComponent;
  let fixture: ComponentFixture<SshCoursesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SshCoursesListComponent]
    });
    fixture = TestBed.createComponent(SshCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
