import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgDetailsComponent } from './sg-details.component';

describe('SgDetailsComponent', () => {
  let component: SgDetailsComponent;
  let fixture: ComponentFixture<SgDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SgDetailsComponent]
    });
    fixture = TestBed.createComponent(SgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
