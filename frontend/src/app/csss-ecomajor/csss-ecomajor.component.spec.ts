import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsssEcomajorComponent } from './csss-ecomajor.component';

describe('CsssEcomajorComponent', () => {
  let component: CsssEcomajorComponent;
  let fixture: ComponentFixture<CsssEcomajorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsssEcomajorComponent]
    });
    fixture = TestBed.createComponent(CsssEcomajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
