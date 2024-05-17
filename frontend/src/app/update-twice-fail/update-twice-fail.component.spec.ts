import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTwiceFailComponent } from './update-twice-fail.component';

describe('UpdateTwiceFailComponent', () => {
  let component: UpdateTwiceFailComponent;
  let fixture: ComponentFixture<UpdateTwiceFailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTwiceFailComponent]
    });
    fixture = TestBed.createComponent(UpdateTwiceFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
