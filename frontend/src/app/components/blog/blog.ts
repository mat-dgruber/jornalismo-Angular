import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostList } from '../post-list/post-list';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrls: ['./blog.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, PostList]
})
export class Blog {
}
