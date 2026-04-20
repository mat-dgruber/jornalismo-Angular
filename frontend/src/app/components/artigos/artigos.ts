import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArtigosService, Artigo } from '../../services/artigos.service';
import { SeoService } from '../../services/seo.service';


@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './artigos.html',
  styleUrl: './artigos.css'
})
export class Artigos implements OnInit {
  articles: Artigo[] = []; 
  private artigosService = inject(ArtigosService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Artigos | Maria Izabela',
      description: 'Leia as reflexões e reportagens mais recentes de Maria Izabela sobre comunicação, sociedade e jornalismo.',
      url: '/artigos'
    });
    this.artigosService.getArtigos().subscribe((data) => {
        this.articles = data.reverse(); // Show newest first
    });
  }
}
