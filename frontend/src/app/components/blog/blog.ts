import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostList } from '../post-list/post-list';
import { SeoService } from '../../services/seo.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrls: ['./blog.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, PostList]
})
export class Blog implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Blog',
      description: 'Acompanhe as reflexões, notícias e conteúdos exclusivos no blog de Maria Izabela.',
      url: '/blog'
    });
  }
}
