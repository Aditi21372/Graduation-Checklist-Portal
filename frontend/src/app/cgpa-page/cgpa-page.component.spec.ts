import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CgpaPageComponent } from './cgpa-page.component';

describe('CgpaPageComponent', () => {
  let component: CgpaPageComponent;
  let fixture: ComponentFixture<CgpaPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatTableModule,
        MatCardModule,
      ],
      declarations: [CgpaPageComponent]
    });
    fixture = TestBed.createComponent(CgpaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
