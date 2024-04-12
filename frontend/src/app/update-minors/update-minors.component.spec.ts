import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMinorsComponent } from './update-minors.component';

describe('UpdateMinorsComponent', () => {
  let component: UpdateMinorsComponent;
  let fixture: ComponentFixture<UpdateMinorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMinorsComponent]
    });
    fixture = TestBed.createComponent(UpdateMinorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
