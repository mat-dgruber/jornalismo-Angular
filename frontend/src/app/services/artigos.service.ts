import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Artigo {
  id?: number;
  titulo: string;
  subtitulo?: string;
  conteudo: string;
  data_publicacao: string;
  local_publicacao: string;
  link_externo?: string;
  imagem?: string;
  slug?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtigosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/artigos/`;

  getArtigos(): Observable<Artigo[]> {
    return this.http.get<Artigo[]>(this.apiUrl);
  }

  getArtigo(slug: string): Observable<Artigo> {
    return this.http.get<Artigo>(`${this.apiUrl}${slug}/`);
  }

  createArtigo(artigo: FormData): Observable<Artigo> {
    return this.http.post<Artigo>(this.apiUrl, artigo);
  }

  updateArtigo(slug: string, artigo: FormData): Observable<Artigo> {
    return this.http.put<Artigo>(`${this.apiUrl}${slug}/`, artigo);
  }

  deleteArtigo(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${slug}/`);
  }
}
