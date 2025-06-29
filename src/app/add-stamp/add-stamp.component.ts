import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { StampService } from '../stamp.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-stamp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-stamp.component.html',
  styleUrls: ['./add-stamp.component.css']
})
export class AddStampComponent implements OnInit {
  stampForm: FormGroup;
  files: File[] = []; // To store selected files
  allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml', 'text/html'];
  maxFileSize = 5 * 1024 * 1024; // 5 MB
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

  constructor(
    private fb: FormBuilder,
    private stampService: StampService,
    private router: Router
  ) {
    this.stampForm = this.fb.group({
      stampType: ['', Validators.required],
      releaseYear: [null, Validators.required],
      dateOfIssue: ['', Validators.required],
      name: ['', Validators.required],
      stampSubHeader: [''],
      specificStampDetails: [''],
      celebratingYear: [''],
      value: [null, Validators.required],
      extraDetails: [''],
      categoryType1: ['', Validators.required],
      categoryType2: [''],
      categoryType3: [''],
      comments: [''],
      location: [''],
      referenceLinks: this.fb.array([]),
      files: [[]],
      numberOfStamps: [null],
      stampValues: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.stampForm.get('stampType')?.valueChanges.subscribe((value: string) => {
      const categoryType2 = this.stampForm.get('categoryType2');
      const categoryType3 = this.stampForm.get('categoryType3');
      const numberOfStamps = this.stampForm.get('numberOfStamps');
      const valueControl = this.stampForm.get('value');

      if (value === 'Miniature Sheet') {
        categoryType2?.reset();
        categoryType2?.disable();
        categoryType3?.reset();
        categoryType3?.disable();
        numberOfStamps?.setValidators([Validators.required]);
        valueControl?.disable();
      } else {
        categoryType2?.enable();
        categoryType3?.enable();
        numberOfStamps?.clearValidators();
        numberOfStamps?.reset();
        valueControl?.enable();
        this.stampValues.clear();
      }
      numberOfStamps?.updateValueAndValidity();
    });

    this.stampForm.get('numberOfStamps')?.valueChanges.subscribe((numStamps: number) => {
      this.updateStampValues(numStamps);
    });

    this.stampValues.valueChanges.subscribe(values => {
      const totalValue = values.reduce((acc:any, curr:any) => acc + curr, 0);
      this.stampForm.get('value')?.setValue(totalValue, { emitEvent: false });
    });
  }

  get referenceLinks() {
    return this.stampForm.get('referenceLinks') as FormArray;
  }

  get stampValues() {
    return this.stampForm.get('stampValues') as FormArray;
  }

  updateStampValues(numStamps: number) {
    if (numStamps === null || numStamps < 0) {
      this.stampValues.clear();
      return;
    }

    while (this.stampValues.length !== numStamps) {
      if (this.stampValues.length < numStamps) {
        this.stampValues.push(this.fb.control(null, Validators.required));
      } else {
        this.stampValues.removeAt(this.stampValues.length - 1);
      }
    }
  }

  addReferenceLink() {
    this.referenceLinks.push(this.fb.control(''));
  }

  removeReferenceLink(index: number) {
    this.referenceLinks.removeAt(index);
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (this.allowedFileTypes.includes(file.type) && file.size <= this.maxFileSize) {
          this.files.push(file);
        } else {
          // Handle invalid file type or size (e.g., show an error message)
          console.warn(`File ${file.name} is not allowed or exceeds size limit.`);
        }
      }
      this.stampForm.patchValue({ files: this.files });
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.stampForm.patchValue({ files: this.files });
  }

  onSubmit() {
    if (this.stampForm.valid) {
      const newStamp = {
        id: Date.now(),
        ...this.stampForm.value,
        files: this.files.map(file => file.name), // Pass only file names to the service
        createdAt: new Date()
      };
      this.stampService.addStamp(newStamp);
      this.router.navigate(['/stamps']);
    } else {
      this.markAllAsTouched(this.stampForm);
    }
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markAllAsTouched(control as FormGroup);
      }
    });
  }

  onReset() {
    this.stampForm.reset();
    this.referenceLinks.clear(); // Clear links on reset
    this.files = []; // Clear selected files on reset
  }

  onCancel() {
    this.router.navigate(['/stamps']);
  }
}
