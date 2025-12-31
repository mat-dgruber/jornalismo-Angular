import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsageStats {
  database: {
    used_bytes: number;
    limit_bytes: number;
    percentage: number;
  };
  storage: {
    used_bytes: number;
    limit_bytes: number;
    percentage: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin/`;

  constructor(private http: HttpClient) { }

  getUsageStats(): Observable<UsageStats> {
    return this.http.get<UsageStats>(`${this.apiUrl}usage/`);
  }
}
