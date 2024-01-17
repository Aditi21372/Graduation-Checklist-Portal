import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocMthComponent } from './toc-mth.component';

describe('TocMthComponent', () => {
  let component: TocMthComponent;
  let fixture: ComponentFixture<TocMthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TocMthComponent]
    });
    fixture = TestBed.createComponent(TocMthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
