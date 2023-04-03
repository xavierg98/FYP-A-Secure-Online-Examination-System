import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { ValidateComponent } from './validate/validate.component';
import { CameracheckComponent } from './cameracheck/cameracheck.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'detail/:id', component: UserDetailComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'examlist', component: ExamListComponent },
  { path: 'exam/:id', component: ExamDetailComponent },
  { path: 'validate', component: ValidateComponent },
  { path: 'cameracheck', component: CameracheckComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
