import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinorsDetailsComponent } from './minors-details.component';

describe('MinorsDetailsComponent', () => {
  let component: MinorsDetailsComponent;
  let fixture: ComponentFixture<MinorsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinorsDetailsComponent]
    });
    fixture = TestBed.createComponent(MinorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
