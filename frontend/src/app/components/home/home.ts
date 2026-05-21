import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { articles } from './articles';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
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
  imports: [RouterLink, CommonModule, SkeletonModule, DialogModule, ButtonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {
  latestArticle!: Article;
  recentPosts: Post[] = [];
  recentMaterials: Material[] = [];
  recentArticles: Artigo[] = [];
  recentProjects: Projeto[] = [];

  isLoadingPosts = true;
  isLoadingMaterials = true;
  isLoadingArticles = true;
  isLoadingProjects = true;

  isCertificationsModalVisible = false;

  lattesData = {
    nome: 'Maria Izabela Araújo',
    id: '5526357506410764',
    url: 'https://lattes.cnpq.br/5526357506410764',
    formacao: [
      {
        periodo: '2025',
        curso: 'Bacharelado em Jornalismo',
        instituicao: 'Centro Universitário Internacional Uninter (Bolsista)'
      },
      {
        periodo: '2022',
        curso: 'Bacharelado em Teologia',
        instituicao: 'Centro Universitário Internacional Uninter'
      }
    ],
    complementar: [
      { periodo: '2025', curso: 'Hebraico Bíblico e Cultura Judaica', carga: '50h' },
      { periodo: '2025', curso: 'Literatura Brasileira - Formação de Lei', carga: '5h' },
      { periodo: '2025', curso: 'Francês Básico', carga: '30h' },
      { periodo: '2025', curso: 'Língua Inglesa (Basic & Intermediate)', carga: '84h' },
      { periodo: '2025', curso: 'Desafios da Diversidade Religiosa', carga: '5h' },
      { periodo: '2025', curso: 'Historiadores e as Conexões', carga: '5h' },
      { periodo: '2025', curso: 'Como preparar artigos para publicação acadêmica', carga: '2h' },
      { periodo: '2025', curso: 'Mulheres na Teologia', carga: '2h' },
      { periodo: '2024', curso: 'Papel das Religiões no Espaço Público', carga: '5h' }
    ],
    resumo: 'Sólida formação acadêmica com dupla graduação em Teologia (2022) e Jornalismo (2025). Experiência principal em Teologia, com aprofundamento em Linguagens, Cultura e Temas Sociais. Comprometida em conectar Humanidades com inovações do mercado.'
  };

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Maria Izabela | Início',
      description: 'Explore o portfólio de Maria Izabela. Soluções em comunicação digital, jornalismo ético e projetos multi-disciplinares.',
      keywords: 'comunicação, jornalismo, marketing, portfólio, maria izabela',
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

  ngAfterViewInit(): void {
    // Se não houver fragmento (âncora) na URL, força o scroll para o topo
    // para evitar que o navegador pule para seções intermediárias no carregamento inicial
    if (!this.route.snapshot.fragment) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  showCertifications() {
    this.isCertificationsModalVisible = true;
  }
}
