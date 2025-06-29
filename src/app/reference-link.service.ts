import { Injectable } from '@angular/core';
import { ReferenceLink } from './reference-link.model';

@Injectable({
  providedIn: 'root'
})
export class ReferenceLinkService {
  private referenceLinks: ReferenceLink[] = [];
  private localStorageKey = 'referenceLinks';

  constructor() {
    this.loadReferenceLinks();
  }

  private loadReferenceLinks(): void {
    const storedLinks = localStorage.getItem(this.localStorageKey);
    if (storedLinks) {
      this.referenceLinks = JSON.parse(storedLinks).map((link: ReferenceLink) => ({
        ...link,
        addedOn: new Date(link.addedOn) // Convert date string back to Date object
      }));
    }
  }

  private saveReferenceLinks(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.referenceLinks));
  }

  getReferenceLinks(): ReferenceLink[] {
    return [...this.referenceLinks]; // Return a copy to prevent direct modification
  }

  addReferenceLink(link: ReferenceLink): void {
    this.referenceLinks.push(link);
    this.saveReferenceLinks();
  }

  updateReferenceLink(updatedLink: ReferenceLink): void {
    const index = this.referenceLinks.findIndex(link => link.id === updatedLink.id);
    if (index !== -1) {
      this.referenceLinks[index] = updatedLink;
      this.saveReferenceLinks();
    }
  }

  deleteReferenceLink(id: number): void {
    this.referenceLinks = this.referenceLinks.filter(link => link.id !== id);
    this.saveReferenceLinks();
  }
}
