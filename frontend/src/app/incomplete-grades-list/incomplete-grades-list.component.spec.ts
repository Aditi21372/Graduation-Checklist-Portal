import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteGradesListComponent } from './incomplete-grades-list.component';

describe('IncompleteGradesListComponent', () => {
  let component: IncompleteGradesListComponent;
  let fixture: ComponentFixture<IncompleteGradesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncompleteGradesListComponent]
    });
    fixture = TestBed.createComponent(IncompleteGradesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
