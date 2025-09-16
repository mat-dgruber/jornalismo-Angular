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


export const routes: Routes = [
     {path: '', component: Home},
     {path: 'artigos', component: Artigos},
     {path: 'projetos', component: Projetos},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: 'contato', component: Contato},
     {path: 'blog/:id', component: PostComponent },
     {path: 'blog', component: BlogComponent},
     {path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)},
     {path: '**', redirectTo: ''},
];
