import { Component, inject } from '@angular/core';
import { PostService, Post } from '../services/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrls: ['./blog.css']
})
export class BlogComponent {
  posts$: Observable<Post[]>;
  postService = inject(PostService);

  constructor() {
    this.posts$ = this.postService.getPosts();
  }
}
