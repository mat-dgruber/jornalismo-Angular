import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
     { path: '', component: Home },
     { 
         path: 'login', 
         loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
     },
     { 
         path: 'admin', 
         loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard), 
         canActivate: [authGuard] 
     },
     { 
         path: 'admin/materiais', 
         loadComponent: () => import('./components/material-list/material-list').then(m => m.MaterialList), 
         canActivate: [authGuard] 
     },
     { 
         path: 'admin/posts', 
         loadComponent: () => import('./components/admin-post-list/admin-post-list').then(m => m.AdminPostList), 
         canActivate: [authGuard] 
     },
     { 
         path: 'admin/artigos', 
         loadComponent: () => import('./components/admin-artigo-list/admin-artigo-list').then(m => m.AdminArtigoList), 
         canActivate: [authGuard] 
     },
     { 
         path: 'admin/projetos', 
         loadComponent: () => import('./components/admin-projeto-list/admin-projeto-list').then(m => m.AdminProjetoList), 
         canActivate: [authGuard] 
     },
     
     { 
         path: 'admin/sucesso', 
         loadComponent: () => import('./components/feedback-success/feedback-success').then(m => m.FeedbackSuccess), 
         canActivate: [authGuard] 
     },
     { 
         path: 'admin/erro', 
         loadComponent: () => import('./components/feedback-error/feedback-error').then(m => m.FeedbackError), 
         canActivate: [authGuard] 
     },
     
     { 
         path: 'blog', 
         loadComponent: () => import('./components/blog/blog').then(m => m.Blog) 
     },
     {
         path: 'post/create', 
         loadComponent: () => import('./components/post-create/post-create').then(m => m.PostCreate), 
         canActivate: [authGuard]
     },
     {
         path: 'post/editar/:slug', 
         loadComponent: () => import('./components/post-create/post-create').then(m => m.PostCreate), 
         canActivate: [authGuard]
     },
     { 
         path: 'post/:slug', 
         loadComponent: () => import('./components/post-detail/post-detail').then(m => m.PostDetail) 
     },
     
     {
         path: 'artigos', 
         loadComponent: () => import('./components/artigos/artigos').then(m => m.Artigos)
     },
     {
         path: 'artigos/novo', 
         loadComponent: () => import('./components/artigo-create/artigo-create').then(m => m.ArtigoCreate), 
         canActivate: [authGuard]
     },
     {
         path: 'artigos/editar/:id', 
         loadComponent: () => import('./components/artigo-create/artigo-create').then(m => m.ArtigoCreate), 
         canActivate: [authGuard]
     },
     
     {
         path: 'materiais/novo', 
         loadComponent: () => import('./components/material-create/material-create').then(m => m.MaterialCreate), 
         canActivate: [authGuard]
     },
     {
         path: 'materiais/editar/:id', 
         loadComponent: () => import('./components/material-create/material-create').then(m => m.MaterialCreate), 
         canActivate: [authGuard]
     },
     {
         path: 'materiais', 
         loadComponent: () => import('./components/materiais/materiais').then(m => m.Materiais)
     },
     
     {
         path: 'projetos', 
         loadComponent: () => import('./components/projetos/projetos').then(m => m.Projetos)
     },
     {
         path: 'projetos/novo', 
         loadComponent: () => import('./components/projeto-create/projeto-create').then(m => m.ProjetoCreate), 
         canActivate: [authGuard]
     },
     {
         path: 'projetos/editar/:id', 
         loadComponent: () => import('./components/projeto-create/projeto-create').then(m => m.ProjetoCreate), 
         canActivate: [authGuard]
     },
     {
         path: 'projeto-tcc', 
         loadComponent: () => import('./components/projeto-tcc/projeto-tcc').then(m => m.ProjetoTCC)
     },
     {
         path: 'contato', 
         loadComponent: () => import('./components/contato/contato').then(m => m.Contato)
     },
     {path: '**', redirectTo: ''},
];
