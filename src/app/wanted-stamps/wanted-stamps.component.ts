import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WantedStampService } from '../wanted-stamp.service';
import { WantedStamp } from '../wanted-stamp.model';

@Component({
  selector: 'app-wanted-stamps',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wanted-stamps.component.html',
  styleUrls: ['./wanted-stamps.component.css']
})
export class WantedStampsComponent implements OnInit {
  wantedStamps: WantedStamp[] = [];
  wantedStampForm: FormGroup;
  editingStamp: WantedStamp | null = null;

  stampTypeOptions: string[] = [
    '', // Empty option for default
    'Stamp',
    'Miniature Sheet',
    'First Day Cover',
    'Special Cover'
  ];

  constructor(private fb: FormBuilder, private wantedStampService: WantedStampService) {
    this.wantedStampForm = this.fb.group({
      stampType: [''],
      releaseYear: [null],
      dateOfIssue: [''],
      name: ['', Validators.required],
      aboutStamp: [''],
      value: [null]
    });
  }

  ngOnInit(): void {
    this.loadWantedStamps();
  }

  loadWantedStamps(): void {
    this.wantedStamps = this.wantedStampService.getWantedStamps();
  }

  addWantedStamp(): void {
    if (this.wantedStampForm.valid) {
      const newStamp: WantedStamp = {
        id: Date.now(), // Simple unique ID
        ...this.wantedStampForm.value,
        addedOn: new Date()
      };
      this.wantedStampService.addWantedStamp(newStamp);
      this.wantedStampForm.reset();
      this.loadWantedStamps();
    }
  }

  editWantedStamp(stamp: WantedStamp): void {
    this.editingStamp = { ...stamp }; // Create a copy for editing
    this.wantedStampForm.patchValue({
      stampType: stamp.stampType,
      releaseYear: stamp.releaseYear,
      dateOfIssue: stamp.dateOfIssue,
      name: stamp.name,
      aboutStamp: stamp.aboutStamp,
      value: stamp.value
    });
  }

  updateWantedStamp(): void {
    if (this.editingStamp && this.wantedStampForm.valid) {
      const updatedStamp: WantedStamp = {
        ...this.editingStamp,
        ...this.wantedStampForm.value
      };
      this.wantedStampService.updateWantedStamp(updatedStamp);
      this.cancelEdit();
      this.loadWantedStamps();
    }
  }

  cancelEdit(): void {
    this.editingStamp = null;
    this.wantedStampForm.reset();
  }

  deleteWantedStamp(id: number): void {
    this.wantedStampService.deleteWantedStamp(id);
    this.loadWantedStamps();
  }
}
