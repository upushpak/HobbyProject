import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stamp } from '../stamp.model';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-stamp-details',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './stamp-details.component.html',
  styleUrls: ['./stamp-details.component.css']
})
export class StampDetailsComponent implements OnInit {
  stamp: Stamp | undefined;
  editedStamp!: Stamp; // To hold editable data
  editMode: { [key: string]: boolean } = {}; // To track edit mode for each field
  categoryOptions: string[] = [
    '', // Empty option for default
    'Cinema/Arts/Stages',
    'Company/Organization/Factory/Industry',
    'Conference/Meeting',
    'Dance/Culture/Art',
    'Defence',
    'Fashion',
    'Festival',
    'Flora/Fauna',
    'Food',
    'Govt. Office',
    'History',
    'Initiatives',
    'Institute/Research',
    'Joint Issue',
    'Location',
    'Movement',
    'Personality',
    'Religious',
    'School/College/University',
    'Science',
    'Sports/Games/Events',
    'War',
    'World Day'
  ];
  stampTypeOptions: string[] = [
    '', // Empty option for default
    'Stamp',
    'Miniature Sheet',
    'First Day Cover',
    'Special Cover'
  ];
  allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml', 'text/html'];
  maxFileSize = 5 * 1024 * 1024; // 5 MB

  constructor(
    private route: ActivatedRoute,
    private stampService: StampService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log('StampDetailsComponent: Attempting to fetch stamp with ID:', id);
      if (id) {
        this.stampService.getStamp(id).subscribe(foundStamp => {
          if (foundStamp) {
            this.stamp = foundStamp;
            this.editedStamp = { 
              ...foundStamp, 
              referenceLinks: foundStamp.referenceLinks || [],
              files: foundStamp.files || [],
              fieldTimestamps: foundStamp.fieldTimestamps || {}
            }; // Create a copy for editing

            // Initialize fieldTimestamps for all fields if not already set
            if (this.stamp) {
              if (!this.stamp.fieldTimestamps) {
                this.stamp.fieldTimestamps = {};
              }
              for (const key in this.stamp) {
                if (this.stamp.hasOwnProperty(key) && key !== 'fieldTimestamps' && key !== 'createdAt') {
                  if (!(this.stamp.fieldTimestamps as any)[key] && this.stamp.createdAt) {
                    (this.stamp.fieldTimestamps as any)[key] = this.stamp.createdAt;
                  }
                }
              }
            }
          } else {
            // Handle case where stamp is not found, e.g., navigate away or show error
            // For now, we'll initialize with default values to prevent errors
            this.stamp = { id: 0, name: '', dateOfIssue: '', value: 0, referenceLinks: [], files: [], stampType: '' };
            this.editedStamp = { ...this.stamp };
          }
        });
      }
    });
  }

  toggleEdit(field: string): void {
    this.editMode[field] = !this.editMode[field];
  }

  updateField(field: string, index?: number, value?: any): void {
    if (this.editedStamp && this.stamp) {
      if (index !== undefined && value !== undefined) {
        // For array fields (referenceLinks, files)
        (this.editedStamp as any)[field][index] = value;
      }
      // Update only the specific field that was edited
      (this.stamp as any)[field] = (this.editedStamp as any)[field];

      // Update field timestamp
      if (!this.stamp.fieldTimestamps) {
        this.stamp.fieldTimestamps = {};
      }
      this.stamp.fieldTimestamps[field] = new Date();

      this.stampService.updateStamp(this.stamp).subscribe(() => {
        this.toggleEdit(field); // Exit edit mode for this field
      });
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addReferenceLink(): void {
    if (!this.editedStamp.referenceLinks) {
      this.editedStamp.referenceLinks = [];
    }
    this.editedStamp.referenceLinks.push('');
    this.updateField('referenceLinks');
  }

  removeReferenceLink(index: number): void {
    if (this.editedStamp.referenceLinks) {
      this.editedStamp.referenceLinks.splice(index, 1);
      this.updateField('referenceLinks');
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (this.allowedFileTypes.includes(file.type) && file.size <= this.maxFileSize) {
          if (!this.editedStamp.files) {
            this.editedStamp.files = [];
          }
          this.editedStamp.files.push(file.name); // Store file name
        } else {
          console.warn(`File ${file.name} is not allowed or exceeds size limit.`);
        }
      }
      this.updateField('files');
    }
  }

  removeFile(index: number): void {
    if (this.editedStamp.files) {
      this.editedStamp.files.splice(index, 1);
      this.updateField('files');
    }
  }
}