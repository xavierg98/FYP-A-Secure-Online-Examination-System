import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamAddComponent } from './exam-add/exam-add.component';
import { ExamEditComponent } from './exam-edit/exam-edit.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { ValidateComponent } from './validate/validate.component';
import { CameracheckComponent } from './cameracheck/cameracheck.component';


@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserDetailComponent,
    UserLoginComponent,
    ExamListComponent,
    ExamAddComponent,
    ExamEditComponent,
    ExamDetailComponent,
    ValidateComponent,
    CameracheckComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
