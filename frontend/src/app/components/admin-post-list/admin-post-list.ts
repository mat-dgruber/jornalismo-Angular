import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../services/post.model';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-admin-post-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ConfirmDialogModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-post-list.html',
  styleUrl: './admin-post-list.css',
  providers: [ConfirmationService]
})
export class AdminPostList implements OnInit {
  posts: Post[] = [];
  private blogService = inject(BlogService);
  private confirmationService = inject(ConfirmationService);

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getPosts().subscribe(data => {
      this.posts = data;
    });
  }

  deletePost(slug: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta notícia?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      accept: () => {
        this.blogService.deletePost(slug).subscribe(() => {
          this.loadPosts();
        });
      }
    });
  }
}
