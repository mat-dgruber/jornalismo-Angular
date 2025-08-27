import { Routes } from '@angular/router';
import { Footer } from './footer/footer';
import { Home } from './home/home';
import { Header } from './header/header';
import { Artigos } from './artigos/artigos';
import { Projetos } from './projetos/projetos';
import { ProjetoTCC } from './projeto-tcc/projeto-tcc';


export const routes: Routes = [
     {path: '', component: Home},
     {path: 'artigos', component: Artigos},
     {path: 'projetos', component: Projetos},
     {path: 'projeto-tcc', component: ProjetoTCC},
     {path: '**', redirectTo: ''},
];
