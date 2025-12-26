import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Projeto {
  id?: number;
  titulo: string;
  descricao: string;
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
  private apiUrl = `${environment.apiUrl}/projetos/`;

  getProjetos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.apiUrl);
  }

  getProjeto(id: number): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.apiUrl}${id}/`);
  }

  createProjeto(projeto: FormData): Observable<Projeto> {
    return this.http.post<Projeto>(this.apiUrl, projeto);
  }

  updateProjeto(id: number, projeto: FormData): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.apiUrl}${id}/`, projeto);
  }

  deleteProjeto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
