import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ProjetosService, Projeto } from '../../services/projetos.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonModule],
  templateUrl: './projetos.html',
  styleUrls: ['./projetos.css']
})
export class Projetos implements OnInit {
  projects: Projeto[] = [];
  isLoading = true;
  private projetosService = inject(ProjetosService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Projetos',
      description: 'Conheça os projetos acadêmicos e pessoais desenvolvidos por Maria Izabela.',
      url: '/projetos'
    });
    this.projetosService.getProjetos().subscribe({
      next: (data) => {
        this.projects = [...data].reverse();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
