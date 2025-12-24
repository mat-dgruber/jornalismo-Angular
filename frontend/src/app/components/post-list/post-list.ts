import { Component, OnInit, inject, signal } from '@angular/core';
import { PostService } from '../../services/post';
import { Post } from '../../services/post.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-post-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList implements OnInit{
  private postService = inject(PostService);

  // Criamos um Signal para armazernar a lista de posts
  // Iniciamos com um array vazio
  posts = signal<Post[]>([]);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        // Atualizamos o valor do Signal usando o .set()
        this.posts.set(data)
      },
      error: (err) => console.error('Erro ao buscar posts:', err)
    })
  }

}
