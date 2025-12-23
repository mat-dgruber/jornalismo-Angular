import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { articles } from '../home/articles';

interface Article {
  title: string;
  description: string;
  source: string;
  url: string;
}

@Component({
  selector: 'app-artigos',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './artigos.html',
  styleUrl: './artigos.css'
})
export class Artigos implements OnInit {
  articles: Article[] = []; // Variável para armazenar o array de artigos

  ngOnInit(): void {
    // Atribua o array de artigos à sua variável em ordem inversa
    this.articles = articles.slice().reverse();
  }
} {

}
