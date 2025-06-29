import { Injectable } from '@angular/core';
import { WantedStamp } from './wanted-stamp.model';

@Injectable({
  providedIn: 'root'
})
export class WantedStampService {
  private wantedStamps: WantedStamp[] = [];
  private localStorageKey = 'wantedStamps';

  constructor() {
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
  }

  updateWantedStamp(updatedStamp: WantedStamp): void {
    const index = this.wantedStamps.findIndex(stamp => stamp.id === updatedStamp.id);
    if (index !== -1) {
      this.wantedStamps[index] = updatedStamp;
      this.saveWantedStamps();
    }
  }

  deleteWantedStamp(id: number): void {
    this.wantedStamps = this.wantedStamps.filter(stamp => stamp.id !== id);
    this.saveWantedStamps();
  }
}
