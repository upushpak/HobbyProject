import { Injectable } from '@angular/core';
import { WantedStamp } from './wanted-stamp.model';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root'
})
export class WantedStampService {
  private wantedStamps: WantedStamp[] = [];
  private localStorageKey = 'wantedStamps';

  constructor(private auditService: AuditService) {
    this.loadWantedStamps();
  }

  private loadWantedStamps(): void {
    const storedStamps = localStorage.getItem(this.localStorageKey);
    if (storedStamps) {
      this.wantedStamps = JSON.parse(storedStamps).map((stamp: WantedStamp) => ({
        ...stamp,
        addedOn: new Date(stamp.addedOn) // Convert date string back to Date object
      }));
    }
  }

  private saveWantedStamps(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.wantedStamps));
  }

  getWantedStamps(): WantedStamp[] {
    return [...this.wantedStamps]; // Return a copy to prevent direct modification
  }

  addWantedStamp(stamp: WantedStamp): void {
    this.wantedStamps.push(stamp);
    this.saveWantedStamps();
    this.auditService.logAction('Add Wanted Stamp', stamp.id || 0, stamp.name).subscribe();
  }

  updateWantedStamp(updatedStamp: WantedStamp): void {
    const index = this.wantedStamps.findIndex(stamp => stamp.id === updatedStamp.id);
    if (index !== -1) {
      this.wantedStamps[index] = updatedStamp;
      this.saveWantedStamps();
      this.auditService.logAction('Update Wanted Stamp', updatedStamp.id || 0, updatedStamp.name).subscribe();
    }
  }

  deleteWantedStamp(id: number): void {
    const deletedStamp = this.wantedStamps.find(stamp => stamp.id === id);
    this.wantedStamps = this.wantedStamps.filter(stamp => stamp.id !== id);
    this.saveWantedStamps();
    if (deletedStamp) {
      this.auditService.logAction('Delete Wanted Stamp', deletedStamp.id || 0, deletedStamp.name).subscribe();
    }
  }
}
