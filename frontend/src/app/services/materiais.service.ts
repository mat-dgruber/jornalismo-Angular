import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Material {
  id: number;
  name: string;
  description: string;
  file?: string;
  image: string;
  category: string;
  slug: string;
  type: 'gratuito' | 'pago';
  external_link?: string;
  price?: number;
  published_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class MateriaisService {
  private apiUrl = `${environment.apiUrl}/api/materiais/`;

  constructor(private http: HttpClient) { }

  getMateriais(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  getMaterial(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}${id}/`);
  }

  createMaterial(data: FormData): Observable<Material> {
      return this.http.post<Material>(this.apiUrl, data);
  }

  updateMaterial(id: number, data: FormData): Observable<Material> {
    return this.http.patch<Material>(`${this.apiUrl}${id}/`, data);
  }

  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
