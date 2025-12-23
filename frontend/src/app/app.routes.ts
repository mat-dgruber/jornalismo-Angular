import { Routes } from '@angular/router';
import { Footer } from './footer/footer';
import { Home } from './home/home';
import { Header } from './header/header';
import { Artigos } from './components/artigos/artigos';
import { Projetos } from './projetos/projetos';
import { ProjetoTCC } from './components/projeto-tcc/projeto-tcc';
import { Contato } from './components/contato/contato';
import { BlogComponent } from './blog/blog';
import { PostComponent } from './post/post';
import { Post } from './services/post';
import { authGuard } from './guards/auth-guard';
import { Materiais } from './materiais/materiais';


export const routes: Routes = [
     {path: '', component: Home},
     {path: 'artigos', component: Artigos},
     {path: 'materiais', component: Materiais},
     {path: 'projetos', component: Projetos},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: 'contato', component: Contato},
     {path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule), canActivate: [authGuard]},
     {path: '**', redirectTo: ''},
];
