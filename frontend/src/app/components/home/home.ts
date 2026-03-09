import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { articles } from './articles';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';
import { MateriaisService, Material } from '../../services/materiais.service';
import { ArtigosService, Artigo } from '../../services/artigos.service';
import { ProjetosService, Projeto } from '../../services/projetos.service';
import { SeoService } from '../../services/seo.service';

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
  imports: [RouterLink, CommonModule, SkeletonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  latestArticle!: Article;
  recentPosts: Post[] = [];
  recentMaterials: Material[] = [];
  recentArticles: Artigo[] = [];
  recentProjects: Projeto[] = [];

  isLoadingPosts = true;
  isLoadingMaterials = true;
  isLoadingArticles = true;
  isLoadingProjects = true;
  
  featuredProject = {
    title: 'FÉ SOB FOGO: UMA ANÁLISE TEOLÓGICA E GEOPOLÍTICA DA PERSEGUIÇÃO AOS CRISTÃOS E O DEVER DE INTERVENÇÃO DOS PAÍSES LIVRES',
    description: 'Este trabalho aborda tanto o desafio da perseguição a cristãos na China quanto em outros países ao redor do mundo, trazendo tanto análises sobre os motivos quanto possíveis soluções para tais ocorrências.',
    link: '/projeto-tcc'
  };
  
  private blogService = inject(BlogService);
  private materiaisService = inject(MateriaisService);
  private artigosService = inject(ArtigosService);
  private projetosService = inject(ProjetosService);
  private seoService = inject(SeoService);

  constructor() { }

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Início',
      description: 'Explore o portfólio de Maria Izabela, unindo Teologia e Jornalismo. Veja artigos, e-books e projetos acadêmicos.',
      url: '/'
    });
    if (articles.length > 0) {
      this.latestArticle = articles[articles.length - 1];
    }

    this.blogService.getPosts().subscribe({
      next: (posts: Post[]) => {
        if (posts.length > 0) {
          this.recentPosts = posts.slice(0, 2);
        }
        this.isLoadingPosts = false;
      },
      error: () => this.isLoadingPosts = false
    });

    this.materiaisService.getMateriais().subscribe({
      next: (materials: Material[]) => {
        if (materials.length > 0) {
          this.recentMaterials = materials.slice(0, 2);
        }
        this.isLoadingMaterials = false;
      },
      error: () => this.isLoadingMaterials = false
    });

    this.artigosService.getArtigos().subscribe({
      next: (artigos: Artigo[]) => {
        if (artigos.length > 0) {
          this.recentArticles = artigos.slice(0, 2);
        }
        this.isLoadingArticles = false;
      },
      error: () => this.isLoadingArticles = false
    });

    this.projetosService.getProjetos().subscribe({
      next: (projetos: Projeto[]) => {
        if (projetos.length > 0) {
          this.recentProjects = projetos.slice(0, 2);
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
        this.isLoadingProjects = false;
      },
      error: () => this.isLoadingProjects = false
    });
  }
}
