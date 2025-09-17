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
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
     {path: '', component: Home},
     {path: 'artigos', component: Artigos},
     {path: 'projetos', component: Projetos},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: 'contato', component: Contato},
     {path: 'post/:id', component: PostComponent },
     {path: 'blog', component: BlogComponent},
     {path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule), canActivate: [authGuard]},
     {path: '**', redirectTo: ''},
];
