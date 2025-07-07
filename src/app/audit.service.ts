import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Audit } from './audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = 'http://localhost:3000/api/audit';

  constructor(private http: HttpClient) { }

  logAction(action: string, stampId: number, stampName: string, details?: any): Observable<Audit> {
    const logEntry: Omit<Audit, 'id' | 'timestamp'> = {
      action,
      stampId,
      stampName,
      details
    };
    return this.http.post<Audit>(this.apiUrl, logEntry);
  }

  getAuditLog(): Observable<Audit[]> {
    return this.http.get<Audit[]>(this.apiUrl);
  }
}
