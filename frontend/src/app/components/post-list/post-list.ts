import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';



import { StripHtmlPipe } from '../../pipes/strip-html.pipe';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, RouterLink, StripHtmlPipe, SkeletonModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList implements OnInit{
  private blogService = inject(BlogService);

  // Criamos um Signal para armazernar a lista de posts
  // Iniciamos com um array vazio
  posts = signal<Post[]>([]);
  isLoading = true;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getPosts().subscribe({
      next: (data: Post[]) => {
        // Atualizamos o valor do Signal usando o .set()
        this.posts.set(data);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar posts:', err);
        this.isLoading = false;
      }
    })
  }

}
