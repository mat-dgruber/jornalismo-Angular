import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from '../services/post';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  styleUrls: ['./post.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PostComponent implements OnInit {
  post$: Observable<Post | undefined> = of(undefined);
  postService = inject(PostService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.post$ = this.postService.getPost(postId);
    }
  }
}
