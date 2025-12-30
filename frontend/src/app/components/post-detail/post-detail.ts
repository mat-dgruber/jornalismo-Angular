import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../../services/post.model';
import { BlogService } from '../../services/blog.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { AuthorNamePipe } from '../../pipes/author-name.pipe';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, AuthorNamePipe, SkeletonModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css'
})
export class PostDetail {
  readonly arrowLeft = ArrowLeft;
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  postResource = rxResource<Post, any>({
    params: () => this.route.snapshot.paramMap.get('slug') || undefined,
    stream: ({params: slug}) => this.blogService.getPost(slug)
  });
}
