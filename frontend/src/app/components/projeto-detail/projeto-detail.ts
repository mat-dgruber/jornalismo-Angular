import { Component, inject, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService, Projeto } from '../../services/projetos.service';
import { SeoService } from '../../services/seo.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-projeto-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, SkeletonModule],
  templateUrl: './projeto-detail.html',
  styleUrl: './projeto-detail.css'
})
export class ProjetoDetail {
  readonly arrowLeft = ArrowLeft;
  private route = inject(ActivatedRoute);
  private projetosService = inject(ProjetosService);
  private seoService = inject(SeoService);

  projetoResource = rxResource<Projeto, any>({
    params: () => this.route.snapshot.paramMap.get('slug') || undefined,
    stream: ({params: slug}) => this.projetosService.getProjeto(slug)
  });

  constructor() {
    effect(() => {
      const projeto = this.projetoResource.value();
      if (projeto) {
        this.seoService.updateSeo({
          title: projeto.titulo,
          description: projeto.descricao,
          image: projeto.imagem,
          url: `/projetos/${projeto.slug}`
        });
      }
    });
  }
}
