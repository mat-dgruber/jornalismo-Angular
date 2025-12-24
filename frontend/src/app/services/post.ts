import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})

export class PostService {
  // Injetamos o HttpClient usando a função inject()
  private http = inject(HttpClient);

  // URL base da API
  private apiUrl = 'http://localhost:8000/';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl)
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}${slug}/`);
  }

  createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}post/create/`, postData);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}users/`);
  }
}
