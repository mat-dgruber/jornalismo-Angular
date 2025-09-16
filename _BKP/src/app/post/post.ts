import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from '../services/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class PostComponent {
  post$: Observable<Post>;
  postService = inject(PostService);
  route = inject(ActivatedRoute);

  constructor() {
    const postId = this.route.snapshot.paramMap.get('id');
    this.post$ = this.postService.getPost(postId);
  }
}
