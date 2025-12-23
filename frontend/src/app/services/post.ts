import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class PostService {
  // Injetamos o HttpClient usando a função inject()
  private http = inject(HttpClient);

  // URL base da API
  private apiUrl = 'http://localhost:8000/';

  getPosts() {
    return this.http.get<any[]>(this.apiUrl)
  }
}
