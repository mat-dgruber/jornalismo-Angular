import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { articles } from './articles';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';
import { MateriaisService, Material } from '../../services/materiais.service';
import { ArtigosService, Artigo } from '../../services/artigos.service';
import { ProjetosService, Projeto } from '../../services/projetos.service';

import { Observable } from 'rxjs';

// Define a estrutura de um artigo para um código mais seguro
interface Article {
  title: string;
  description: string;
  source: string;
  url: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  latestArticle!: Article;
  recentPosts: Post[] = [];
  recentMaterials: Material[] = [];
  
  featuredProject = {
    title: 'FÉ SOB FOGO: UMA ANÁLISE TEOLÓGICA E GEOPOLÍTICA DA PERSEGUIÇÃO AOS CRISTÃOS E O DEVER DE INTERVENÇÃO DOS PAÍSES LIVRES',
    description: 'Este trabalho aborda tanto o desafio da perseguição a cristãos na China quanto em outros países ao redor do mundo, trazendo tanto análises sobre os motivos quanto possíveis soluções para tais ocorrências.',
    link: '/projeto-tcc'
  };
  
  private blogService = inject(BlogService);
  private materiaisService = inject(MateriaisService);
  private artigosService = inject(ArtigosService);
  private projetosService = inject(ProjetosService);

  recentArticles: Artigo[] = [];
  recentProjects: Projeto[] = [];

  constructor() { }

  ngOnInit(): void {
    if (articles.length > 0) {
      this.latestArticle = articles[articles.length - 1];
    }

    this.blogService.getPosts().subscribe((posts: Post[]) => {
      if (posts.length > 0) {
        this.recentPosts = posts.slice(-3).reverse();
      }
    });

    this.materiaisService.getMateriais().subscribe((materials: Material[]) => {
      if (materials.length > 0) {
        this.recentMaterials = materials.slice(-3).reverse();
      }
    });

    this.artigosService.getArtigos().subscribe((artigos: Artigo[]) => {
      if (artigos.length > 0) {
        this.recentArticles = artigos.slice(-3).reverse();
      }
    });

    this.projetosService.getProjetos().subscribe((projetos: Projeto[]) => {
      if (projetos.length > 0) {
        this.recentProjects = projetos.slice(-3).reverse();
        // Update featured project if needed, or keep static one for now/randomize
        // For now, let's prefer the featuredProject stay static or use the latest project
        if (this.recentProjects.length > 0) {
            const latest = this.recentProjects[0];
            this.featuredProject = {
                title: latest.titulo,
                description: latest.descricao,
                link: '/projetos' // Or a specific link if we had detail pages
            };
        }
      }
    });
  }
}
