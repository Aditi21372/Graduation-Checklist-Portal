import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentInfoInputComponent } from './student-info-input/student-info-input.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { CgpaPageComponent } from './cgpa-page/cgpa-page.component';
import { CoreCoursesListComponent } from './core-courses-list/core-courses-list.component';
import { SshCoursesListComponent } from './ssh-courses-list/ssh-courses-list.component';
import { OnlineCoursesListComponent } from './online-courses-list/online-courses-list.component';
import { TwoxxCoursesListComponent } from './twoxx-courses-list/twoxx-courses-list.component';
import { BtpDetailsComponent } from './btp-details/btp-details.component';
import { IpDetailsComponent } from './ip-details/ip-details.component';
import { CwDetailsComponent } from './cw-details/cw-details.component';
import { SgDetailsComponent } from './sg-details/sg-details.component';
import { BranchCoursesListComponent } from './branch-courses-list/branch-courses-list.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { IncompleteGradesListComponent } from './incomplete-grades-list/incomplete-grades-list.component';
import { LoginComponent } from './login/login.component';
import { SelectionComponent } from './selection/selection.component';
import { UpdateStudentDatabaseComponent } from './update-student-database/update-student-database.component';
import { HonorsComponent } from './honors/honors.component';
import { MinorsDetailsComponent } from './minors-details/minors-details.component';
import { UpdateStudentGradeComponent } from './update-student-grade/update-student-grade.component';
import { UpdateCourseDatabaseComponent } from './update-course-database/update-course-database.component';
import { AiCoursesComponent } from './ai-courses/ai-courses.component';
import { CsssEcomajorComponent } from './csss-ecomajor/csss-ecomajor.component';
import { StudentsSummaryComponent } from './students-summary/students-summary.component';
import { UpdateStudentDetailsComponent } from './update-student-details/update-student-details.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { UpdateMinorsComponent } from './update-minors/update-minors.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/:rollNumber', component: DashboardComponent },
  { path: 'student-info-input', component: StudentInfoInputComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'cgpa-page', component: CgpaPageComponent },
  { path: 'core-courses-list', component: CoreCoursesListComponent },
  { path: 'ssh-courses-list', component: SshCoursesListComponent },
  { path: 'btp-details', component: BtpDetailsComponent },
  { path: 'ip-details', component: IpDetailsComponent },
  { path: 'cw-details', component: CwDetailsComponent },
  { path: 'sg-details', component: SgDetailsComponent },
  { path: 'online-courses-list', component: OnlineCoursesListComponent },
  { path: 'twoxx-courses-list', component: TwoxxCoursesListComponent },
  { path: 'branch-courses-list', component: BranchCoursesListComponent },
  { path: 'summary-page', component: SummaryPageComponent },
  { path: 'incomplete-grades-list', component: IncompleteGradesListComponent },
  { path: 'selection', component: SelectionComponent },
  {
    path: 'update-student-database',
    component: UpdateStudentDatabaseComponent,
  },
  { path: 'honors', component: HonorsComponent },
  { path: 'minors-detail', component: MinorsDetailsComponent },
  { path: 'update-student-grade', component: UpdateStudentGradeComponent },
  { path: 'update-course-database', component: UpdateCourseDatabaseComponent },
  { path: 'ai-courses', component: AiCoursesComponent },
  { path: 'csss-ecomajor', component: CsssEcomajorComponent },
  { path: 'students-summary', component: StudentsSummaryComponent },
  { path: 'update-student-details', component: UpdateStudentDetailsComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'update-minors', component: UpdateMinorsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
