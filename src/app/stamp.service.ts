import { Injectable } from '@angular/core';
import { Stamp } from './stamp.model';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root'
})
export class StampService {
  private stamps: Stamp[] = [
    { id: 1, name: 'Mahatma Gandhi', dateOfIssue: '1948-08-15', value: 1.5, releaseYear: 1948, stampSubHeader: 'First Definitive Series', specificStampDetails: 'Gandhi\'s portrait', celebratingYear: '75th Anniversary', extraDetails: 'Issued after independence', categoryType1: 'History', categoryType2: 'Personality', categoryType3: 'Initiatives', comments: 'A very important stamp.', location: 'New Delhi, India', referenceLinks: ['https://en.wikipedia.org/wiki/Mahatma_Gandhi_stamp'], createdAt: new Date('1948-08-15T00:00:00Z') },
    { id: 2, name: 'Jawaharlal Nehru', dateOfIssue: '1964-06-09', value: 0.15, releaseYear: 1964, stampSubHeader: 'First Prime Minister', specificStampDetails: 'Nehru\'s portrait', celebratingYear: '75th Anniversary', extraDetails: 'Issued after his death', categoryType1: 'History', categoryType2: 'Personality', categoryType3: 'Initiatives', comments: 'Another significant stamp.', location: 'New Delhi, India', referenceLinks: ['https://en.wikipedia.org/wiki/Jawaharlal_Nehru'], createdAt: new Date('1964-06-09T00:00:00Z') },
    { id: 3, name: 'Sardar Vallabhbhai Patel', dateOfIssue: '1965-10-31', value: 0.15, releaseYear: 1965, stampSubHeader: 'Iron Man of India', specificStampDetails: 'Patel\'s portrait', celebratingYear: '75th Anniversary', extraDetails: 'Issued on his birth anniversary', categoryType1: 'History', categoryType2: 'Personality', categoryType3: 'Initiatives', comments: 'Part of the definitive series.', location: 'Ahmedabad, India', referenceLinks: ['https://en.wikipedia.org/wiki/Sardar_Vallabhbhai_Patel'], createdAt: new Date('1965-10-31T00:00:00Z') },
    { id: 4, name: 'Sample Stamp with File', dateOfIssue: '2023-01-01', value: 10.00, releaseYear: 2023, stampSubHeader: 'Digital Sample', specificStampDetails: 'A sample stamp with an attached file.', celebratingYear: 'N/A', extraDetails: 'For testing file display.', categoryType1: 'Miscellaneous', comments: 'This stamp has an attached sample.pdf.', location: 'Internet', referenceLinks: [], files: ['sample.pdf'], createdAt: new Date('2023-01-01T00:00:00Z') },
  ];

  constructor(private auditService: AuditService) { }

  getStamps(): Stamp[] {
    return this.stamps;
  }

  getStamp(id: number): Stamp | undefined {
    return this.stamps.find(stamp => stamp.id === id);
  }

  addStamp(stamp: Stamp) {
    this.stamps.push(stamp);
    this.auditService.logAction('Add Stamp', stamp.id, stamp.name);
  }

  deleteStamp(id: number) {
    const stamp = this.getStamp(id);
    if (stamp) {
      this.stamps = this.stamps.filter(s => s.id !== id);
      this.auditService.logAction('Delete Stamp', stamp.id, stamp.name);
    }
  }

  updateStamp(updatedStamp: Stamp) {
    const index = this.stamps.findIndex(stamp => stamp.id === updatedStamp.id);
    if (index !== -1) {
      const originalStamp = JSON.parse(JSON.stringify(this.stamps[index]));
      this.stamps[index] = { ...updatedStamp, files: updatedStamp.files as string[] };
      this.auditService.logAction('Update Stamp', updatedStamp.id, updatedStamp.name, { from: originalStamp, to: updatedStamp });
    }
  }
}
