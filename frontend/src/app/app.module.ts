import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StudentSummaryComponent } from "./student-summary/student-summary.component";
import { StudentInfoInputComponent } from "./student-info-input/student-info-input.component";
import { MatTableModule } from "@angular/material/table";
import { ChecklistComponent } from "./checklist/checklist.component";
import { StudentInfoComponent } from "./student-info/student-info.component";
import { StudentServiceService } from "./student-service.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    StudentSummaryComponent,
    ChecklistComponent,
    StudentInfoComponent,
    StudentInfoInputComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [StudentServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
