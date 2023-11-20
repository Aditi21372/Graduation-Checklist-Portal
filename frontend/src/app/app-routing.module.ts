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
import { LoginComponent} from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'dashboard/:rollNumber', component: DashboardComponent },
  { path: 'student-info-input', component: StudentInfoInputComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'cgpa-page', component: CgpaPageComponent },
  { path: 'core-courses-list', component: CoreCoursesListComponent},
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
