import { Component, OnInit } from '@angular/core';
import { AuditService } from './audit.service';
import { Audit } from './audit.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  auditLog: Audit[] = [];

  constructor(private auditService: AuditService) { }

  ngOnInit(): void {
    this.auditService.getAuditLog().subscribe(log => {
      this.auditLog = log.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
  }

  formatDetails(entry: Audit): string {
    if (entry.details) {
      return JSON.stringify(entry.details, null, 2);
    }
    return '';
  }
}
