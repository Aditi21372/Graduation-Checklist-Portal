import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { StudentInfoInputComponent } from "./student-info-input/student-info-input.component";
import { ChecklistComponent } from "./checklist/checklist.component";
import { CgpaPageComponent
 } from "./cgpa-page/cgpa-page.component";
const routes: Routes = [
  { path: "", redirectTo: "/student-info-input", pathMatch: "full" },
  { path: "dashboard/:rollNumber", component: DashboardComponent },
  { path: "student-info-input", component: StudentInfoInputComponent },
  { path: "checklist", component: ChecklistComponent },
  { path: "cgpa-page", component: CgpaPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
