import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Projeto {
  id?: number;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  conteudo?: string;
  data_realizacao: string;
  tipo: 'academico' | 'pessoal';
  link_externo?: string;
  imagem?: string;
  slug?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjetosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/projetos/`;

  getProjetos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.apiUrl);
  }

  getProjeto(slug: string): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.apiUrl}${slug}/`);
  }

  createProjeto(projeto: FormData): Observable<Projeto> {
    return this.http.post<Projeto>(this.apiUrl, projeto);
  }

  updateProjeto(slug: string, projeto: FormData): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.apiUrl}${slug}/`, projeto);
  }

  deleteProjeto(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${slug}/`);
  }
}
