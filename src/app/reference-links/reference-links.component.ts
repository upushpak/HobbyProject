import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReferenceLinkService } from '../reference-link.service';
import { ReferenceLink } from '../reference-link.model';

@Component({
  selector: 'app-reference-links',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reference-links.component.html',
  styleUrls: ['./reference-links.component.css']
})
export class ReferenceLinksComponent implements OnInit {
  referenceLinks: ReferenceLink[] = [];
  referenceLinkForm: FormGroup;
  editingLink: ReferenceLink | null = null;

  constructor(private fb: FormBuilder, private referenceLinkService: ReferenceLinkService) {
    this.referenceLinkForm = this.fb.group({
      url: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLinks();
  }

  loadLinks(): void {
    this.referenceLinks = this.referenceLinkService.getReferenceLinks();
  }

  addLink(): void {
    if (this.referenceLinkForm.valid) {
      const newLink: ReferenceLink = {
        id: Date.now(), // Simple unique ID
        url: this.referenceLinkForm.value.url,
        description: this.referenceLinkForm.value.description,
        addedOn: new Date()
      };
      this.referenceLinkService.addReferenceLink(newLink);
      this.referenceLinkForm.reset();
      this.loadLinks();
    }
  }

  editLink(link: ReferenceLink): void {
    this.editingLink = { ...link }; // Create a copy for editing
    this.referenceLinkForm.patchValue({
      url: link.url,
      description: link.description
    });
  }

  updateLink(): void {
    if (this.editingLink && this.referenceLinkForm.valid) {
      const updatedLink: ReferenceLink = {
        ...this.editingLink,
        url: this.referenceLinkForm.value.url,
        description: this.referenceLinkForm.value.description
      };
      this.referenceLinkService.updateReferenceLink(updatedLink);
      this.cancelEdit();
      this.loadLinks();
    }
  }

  cancelEdit(): void {
    this.editingLink = null;
    this.referenceLinkForm.reset();
  }

  deleteLink(id: number): void {
    this.referenceLinkService.deleteReferenceLink(id);
    this.loadLinks();
  }
}
