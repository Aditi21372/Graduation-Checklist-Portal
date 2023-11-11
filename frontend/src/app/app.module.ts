import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentSummaryComponent } from './student-summary/student-summary.component';
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

@NgModule({
  declarations: [
    AppComponent,
    StudentSummaryComponent,
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
  ],
  providers: [StudentServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
