import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArtigosService, Artigo } from '../../services/artigos.service';


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

  ngOnInit(): void {
    this.artigosService.getArtigos().subscribe((data) => {
        this.articles = data.reverse(); // Show newest first
    });
  }
}
