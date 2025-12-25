import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/api/blog/`;

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPost(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}${slug}/`);
  }

  createPost(data: FormData): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, data);
  }

  updatePost(slug: string, data: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}${slug}/`, data);
  }

  deletePost(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${slug}/`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}users/`);
  }
}
