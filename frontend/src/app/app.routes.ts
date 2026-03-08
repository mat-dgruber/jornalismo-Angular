import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Artigos } from './components/artigos/artigos';
import { Projetos } from './components/projetos/projetos';
import { ProjetoTCC } from './components/projeto-tcc/projeto-tcc';
import { Contato } from './components/contato/contato';
import { Materiais } from './components/materiais/materiais';
import { PostList } from './components/post-list/post-list';
import { PostDetail } from './components/post-detail/post-detail';
import { PostCreate } from './components/post-create/post-create';

import { Blog } from './components/blog/blog';

import { LoginComponent } from './components/login/login.component';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { MaterialCreate } from './components/material-create/material-create';
import { authGuard } from './guards/auth.guard';

import { MaterialList } from './components/material-list/material-list';
import { AdminPostList } from './components/admin-post-list/admin-post-list';
import { AdminArtigoList } from './components/admin-artigo-list/admin-artigo-list';
import { ArtigoCreate } from './components/artigo-create/artigo-create';
import { AdminProjetoList } from './components/admin-projeto-list/admin-projeto-list';
import { ProjetoCreate } from './components/projeto-create/projeto-create';
import { FeedbackSuccess } from './components/feedback-success/feedback-success';
import { FeedbackError } from './components/feedback-error/feedback-error';

export const routes: Routes = [
     {path: '', component: Home},
     { path: 'login', component: LoginComponent },
     { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
     { path: 'admin/materiais', component: MaterialList, canActivate: [authGuard] },
     { path: 'admin/posts', component: AdminPostList, canActivate: [authGuard] },
     { path: 'admin/artigos', component: AdminArtigoList, canActivate: [authGuard] },
     { path: 'admin/projetos', component: AdminProjetoList, canActivate: [authGuard] },
     
     { path: 'admin/sucesso', component: FeedbackSuccess, canActivate: [authGuard] },
     { path: 'admin/erro', component: FeedbackError, canActivate: [authGuard] },
     
     { path: 'blog', component: Blog },
     {path: 'post/create', component: PostCreate, canActivate: [authGuard]},
     {path: 'post/editar/:slug', component: PostCreate, canActivate: [authGuard]},
     { path: 'post/:slug', component: PostDetail },
     
     {path: 'artigos', component: Artigos},
     {path: 'artigos/novo', component: ArtigoCreate, canActivate: [authGuard]},
     {path: 'artigos/editar/:slug', component: ArtigoCreate, canActivate: [authGuard]},
     
     {path: 'materiais/novo', component: MaterialCreate, canActivate: [authGuard]},
     {path: 'materiais/editar/:slug', component: MaterialCreate, canActivate: [authGuard]},
     {path: 'materiais', component: Materiais},
     
     {path: 'projetos', component: Projetos},
     {path: 'projetos/novo', component: ProjetoCreate, canActivate: [authGuard]},
     {path: 'projetos/editar/:slug', component: ProjetoCreate, canActivate: [authGuard]},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: 'contato', component: Contato},
     {path: '**', redirectTo: ''},
];
