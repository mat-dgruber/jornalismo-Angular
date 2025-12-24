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

export const routes: Routes = [
     {path: '', component: Home},
     { path: 'blog', component: Blog },
     {path: 'post/create', component: PostCreate},
     { path: 'post/:slug', component: PostDetail },
     {path: 'artigos', component: Artigos},
     {path: 'materiais', component: Materiais},
     {path: 'projetos', component: Projetos},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: 'contato', component: Contato},
     {path: '**', redirectTo: ''},
];
