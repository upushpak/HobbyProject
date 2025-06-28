import { Injectable } from '@angular/core';
import { Audit } from './audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditLog: Audit[] = [];

  constructor() { }

  logAction(action: string, stampId: number, stampName: string, details?: any) {
    const logEntry: Audit = {
      action,
      stampId,
      stampName,
      timestamp: new Date(),
      details
    };
    this.auditLog.push(logEntry);
  }

  getAuditLog(): Audit[] {
    return this.auditLog;
  }
}
