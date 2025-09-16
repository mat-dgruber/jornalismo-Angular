import { Routes } from '@angular/router';
import { Footer } from './footer/footer';
import { Home } from './home/home';
import { Header } from './header/header';
import { Artigos } from './artigos/artigos';
import { Projetos } from './projetos/projetos';
import { ProjetoTCC } from './projeto-tcc/projeto-tcc';
import { Contato } from './contato/contato';
import { BlogComponent } from './blog/blog';
import { PostComponent } from './post/post';
import { AdminModule } from './admin/admin-module';
import { Post } from './services/post';
import { AuthGuard } from './admin/auth.guard';
import { PostEditComponent } from './admin/post-edit/post-edit';
import { PostListComponent } from './admin/post-list/post-list';
import { LoginComponent } from './admin/login/login';
import { DashboardComponent } from './admin/dashboard/dashboard';


export const routes: Routes = [
     {path: '', component: Home},
     {path: 'artigos', component: Artigos},
     {path: 'projetos', component: Projetos},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: 'contato', component: Contato},
     {path: 'blog/:id', component: PostComponent },
     {path: 'blog', component: BlogComponent},
     {path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)},
     {path: `post-edit/:id`, component: PostEditComponent, canActivate: [AuthGuard]},
     {path: 'post-list', component: PostListComponent, canActivate: [AuthGuard]},
     {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
     {path: 'login', component: LoginComponent},
     {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
     {path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule), canActivate: [AuthGuard]},
     {path: '**', redirectTo: ''},
];
