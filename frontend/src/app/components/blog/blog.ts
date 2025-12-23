import { Component, inject } from '@angular/core';
import { PostService, Post } from '../services/post';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrls: ['./blog.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BlogComponent {
  posts$: Observable<Post[]>;
  postService = inject(PostService);

  constructor() {
    this.posts$ = this.postService.getPosts();
  }
}
