import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { PostListComponent } from './post-list/post-list';
import { PostEditComponent } from './post-edit/post-edit';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    LoginComponent,
    DashboardComponent,
    PostListComponent,
    PostEditComponent
  ]
})
export class AdminModule { }
