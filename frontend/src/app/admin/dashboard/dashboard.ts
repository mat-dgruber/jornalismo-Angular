import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Post, PostService } from '../../services/post';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class DashboardComponent implements OnInit {
  protected posts$!: Observable<Post[]>;
  private postService = inject(PostService);

  ngOnInit(): void {
    this.posts$ = this.postService.getPosts();
  }
}
