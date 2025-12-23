import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { articles } from './articles';
import { CommonModule } from '@angular/common';
import { Post, PostService } from '../services/post';
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
  latestArticle!: Article; // Use "!" para dizer que a variável será inicializada em ngOnInit
  latestPost: Post | undefined;
  private postService = inject(PostService);

  constructor() { }

  ngOnInit(): void {
    // Verifique se o array de artigos não está vazio antes de atribuir
    if (articles.length > 0) {
      this.latestArticle = articles[articles.length - 1];
    }
    
    this.postService.getPosts().subscribe(posts => {
      if (posts.length > 0) {
        this.latestPost = posts[posts.length - 1];
      }
    });
  }
}