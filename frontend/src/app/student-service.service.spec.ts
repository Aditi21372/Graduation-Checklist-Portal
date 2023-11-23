import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from '@angular/common/http';
import { StudentServiceService } from "./student-service.service";

describe("StudentServiceService", () => {
  let service: StudentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [StudentServiceService],
    });
    service = TestBed.inject(StudentServiceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
