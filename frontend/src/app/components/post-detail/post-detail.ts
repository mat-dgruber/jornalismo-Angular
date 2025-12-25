import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../../services/post.model';

import { BlogService } from '../../services/blog.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.html'
})


export class PostDetail {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  postResource = rxResource<Post, any>({
    params: () => this.route.snapshot.paramMap.get('slug') || undefined,
    stream: ({params: slug}) => this.blogService.getPost(slug)
  });
}
