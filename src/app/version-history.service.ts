import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionHistoryService {
  private apiUrl = 'http://localhost:3000/api/version-history';

  constructor(private http: HttpClient) { }

  getVersionHistory(): Observable<GitCommit[]> {
    return this.http.get<GitCommit[]>(this.apiUrl);
  }
}
