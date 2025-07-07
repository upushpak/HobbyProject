import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stamp } from '../stamp.model';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-stamp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-stamp.component.html',
  styleUrls: ['./edit-stamp.component.css']
})
export class EditStampComponent implements OnInit {
  stampForm: FormGroup;
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
    private route: ActivatedRoute,
    private router: Router,
    private stampService: StampService
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
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.stampService.getStamp(id).subscribe(stamp => {
      if (stamp) {
        this.stampForm.patchValue(stamp);
        if (stamp.referenceLinks) {
          stamp.referenceLinks.forEach(link => this.referenceLinks.push(this.fb.control(link)));
        }
        if (stamp.stampValues) {
          stamp.stampValues.forEach(val => this.stampValues.push(this.fb.control(val)));
        }
        // Manually trigger valueChanges for stampType to apply initial logic
        this.stampForm.get('stampType')?.updateValueAndValidity();
      }
    });

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

  onSubmit() {
    if (this.stampForm.valid) {
      const updatedStamp = {
        ...this.stampForm.value,
        id: +this.route.snapshot.paramMap.get('id')!,
        files: this.stampForm.value.files.map((file: File) => file.name), // Assuming files are handled similarly to AddStampComponent
        updatedAt: new Date()
      };
      this.stampService.updateStamp(updatedStamp).subscribe(() => {
        this.router.navigate(['/stamps']);
      });
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

  onCancel() {
    this.router.navigate(['/stamps']);
  }
}
