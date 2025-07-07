import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stamp } from './stamp.model';
import { AuditService } from './audit.service';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StampService {
  private apiUrl = 'http://localhost:3000/api/stamps';

  constructor(private http: HttpClient, private auditService: AuditService) { }

  getStamps(): Observable<Stamp[]> {
    return this.http.get<Stamp[]>(this.apiUrl).pipe(
      map(stamps => stamps.map(stamp => this.processStampValue(stamp)))
    );
  }

  getStamp(id: number): Observable<Stamp> {
    return this.http.get<Stamp>(`${this.apiUrl}/${id}`).pipe(
      map(stamp => this.processStampValue(stamp))
    );
  }

  private processStampValue(stamp: Stamp): Stamp {
    if (stamp.stampType === 'Miniature Sheet' && stamp.stampValues && stamp.stampValues.length > 0) {
      const totalValue = stamp.stampValues.reduce((sum: number, val) => sum + (val || 0), 0);
      return { ...stamp, value: totalValue };
    }
    return stamp;
  }

  addStamp(stamp: Stamp): Observable<Stamp> {
    return this.http.post<Stamp>(this.apiUrl, stamp).pipe(
      tap(newStamp => this.auditService.logAction('Add Stamp', newStamp.id, newStamp.name).subscribe())
    );
  }

  addStamps(stamps: Stamp[]): Observable<Stamp[]> {
    // Assuming your backend API can handle a POST request with an array of stamps
    // If not, you might need to iterate and call addStamp for each, or adjust backend.
    return this.http.post<Stamp[]>(`${this.apiUrl}/bulk`, stamps).pipe(
      tap(newStamps => {
        newStamps.forEach(newStamp => {
          this.auditService.logAction('Add Stamp (Bulk)', newStamp.id, newStamp.name).subscribe();
        });
      })
    );
  }

  deleteStamp(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.auditService.logAction('Delete Stamp', id, '').subscribe()) // Name might not be available after delete
    );
  }

  updateStamp(updatedStamp: Stamp): Observable<Stamp> {
    return this.http.put<Stamp>(`${this.apiUrl}/${updatedStamp.id}`, updatedStamp).pipe(
      tap(updated => this.auditService.logAction('Update Stamp', updated.id, updated.name, { from: null, to: updated }).subscribe()) // 'from' data not easily available from API
    );
  }
}
