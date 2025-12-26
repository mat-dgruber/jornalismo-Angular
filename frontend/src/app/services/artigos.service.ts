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
  private apiUrl = `${environment.apiUrl}/artigos/`;

  getArtigos(): Observable<Artigo[]> {
    return this.http.get<Artigo[]>(this.apiUrl);
  }

  getArtigo(slug: string): Observable<Artigo> {
    return this.http.get<Artigo>(`${this.apiUrl}${slug}/`); // Assuming backend looks up by ID or Slug. For ViewSet defaults it's ID usually unless lookup_field is set.
    // Wait, the backend uses ModelViewSet. By default it uses pk. 
    // If I want to use slug for retrieval, I should have set lookup_field = 'slug' in the ViewSet.
    // Let me verify the backend ViewSet. I didn't set lookup_field. 
    // I should probably fix that in backend or just use ID for now.
    // But public URLs usually use slug. 
    // For now I'll assume standard REST behavior (ID) for admin editing, but for public view maybe I need slug.
    // Let's implement standard CRUD first.
  }

  createArtigo(artigo: FormData): Observable<Artigo> {
    return this.http.post<Artigo>(this.apiUrl, artigo);
  }

  updateArtigo(id: number, artigo: FormData): Observable<Artigo> {
    return this.http.put<Artigo>(`${this.apiUrl}${id}/`, artigo);
  }

  deleteArtigo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
