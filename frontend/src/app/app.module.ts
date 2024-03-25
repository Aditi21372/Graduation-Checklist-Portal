import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentInfoInputComponent } from './student-info-input/student-info-input.component';
import { MatTableModule } from '@angular/material/table';
import { ChecklistComponent } from './checklist/checklist.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentServiceService } from './student-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CgpaPageComponent } from './cgpa-page/cgpa-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreCoursesListComponent } from './core-courses-list/core-courses-list.component';
import { SshCoursesListComponent } from './ssh-courses-list/ssh-courses-list.component';
import { IpDetailsComponent } from './ip-details/ip-details.component';
import { BtpDetailsComponent } from './btp-details/btp-details.component';
import { SgDetailsComponent } from './sg-details/sg-details.component';
import { CwDetailsComponent } from './cw-details/cw-details.component';
import { OnlineCoursesListComponent } from './online-courses-list/online-courses-list.component';
import { TwoxxCoursesListComponent } from './twoxx-courses-list/twoxx-courses-list.component';
import { BranchCoursesListComponent } from './branch-courses-list/branch-courses-list.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IncompleteGradesListComponent } from './incomplete-grades-list/incomplete-grades-list.component';
import { RouterModule } from '@angular/router';
import { SelectionComponent } from './selection/selection.component';
import { UpdateStudentDatabaseComponent } from './update-student-database/update-student-database.component';
import { MatSortModule } from '@angular/material/sort';
import { HonorsComponent } from './honors/honors.component';
import { MinorsDetailsComponent } from './minors-details/minors-details.component';
import { UpdateStudentGradeComponent } from './update-student-grade/update-student-grade.component';
import { UpdateCourseDatabaseComponent } from './update-course-database/update-course-database.component';
import { AiCoursesComponent } from './ai-courses/ai-courses.component';
import { CsssEcomajorComponent } from './csss-ecomajor/csss-ecomajor.component';
import { StudentsSummaryComponent } from './students-summary/students-summary.component';
import { UpdateStudentDetailsComponent } from './update-student-details/update-student-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ChecklistComponent,
    StudentInfoComponent,
    StudentInfoInputComponent,
    DashboardComponent,
    CgpaPageComponent,
    CoreCoursesListComponent,
    SshCoursesListComponent,
    IpDetailsComponent,
    BtpDetailsComponent,
    SgDetailsComponent,
    CwDetailsComponent,
    OnlineCoursesListComponent,
    TwoxxCoursesListComponent,
    BranchCoursesListComponent,
    SummaryPageComponent,
    LoginComponent,
    IncompleteGradesListComponent,
    SelectionComponent,
    UpdateStudentDatabaseComponent,
    HonorsComponent,
    MinorsDetailsComponent,
    UpdateStudentGradeComponent,
    UpdateCourseDatabaseComponent,
    AiCoursesComponent,
    CsssEcomajorComponent,
    StudentsSummaryComponent,
    UpdateStudentDetailsComponent,
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
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    RouterModule,
    MatSortModule,
    MatMenuModule,
  ],
  providers: [StudentServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
