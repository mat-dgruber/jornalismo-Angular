import { Component, inject } from '@angular/core';
import { PostService, Post } from '../../services/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.css']
})
export class PostListComponent {
  posts$: Observable<Post[]>;
  postService = inject(PostService);

  constructor() {
    this.posts$ = this.postService.getPosts();
  }

  deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id);
    }
  }
}
