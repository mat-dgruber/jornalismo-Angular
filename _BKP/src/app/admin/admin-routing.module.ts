import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from '../guards/auth-guard';
import { PostListComponent } from './post-list/post-list';
import { PostEditComponent } from './post-edit/post-edit';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'posts', component: PostListComponent },
      { path: 'posts/new', component: PostEditComponent },
      { path: 'posts/edit/:id', component: PostEditComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
