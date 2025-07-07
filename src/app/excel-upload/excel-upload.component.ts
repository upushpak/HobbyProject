
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { Stamp } from '../stamp.model';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule
  ],
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent {
  isLoading = false;

  constructor(private stampService: StampService, private snackBar: MatSnackBar, private router: Router) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = 'Stamps'; // Explicitly target the 'Stamps' sheet
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any[] = XLSX.utils.sheet_to_json(ws);
      console.log('Parsed Excel Data:', data); // Log the parsed data
      this.processExcelData(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  processExcelData(data: any[]) {
    this.isLoading = true;
    const stampsToUpload: Stamp[] = [];

    for (const row of data) {
      // Ensure row properties are correctly mapped, handling potential undefined values
      const stamp: Stamp = {
        // id: 0, // Removed: ID will be assigned by the service or backend
        name: row['name'] || '',
        dateOfIssue: (() => {
          let dateValue = row['dateOfIssue'];
          if (typeof dateValue === 'number') {
            // Convert Excel serial date number to YYYY-MM-DD string
            return XLSX.SSF.format('yyyy-mm-dd', dateValue);
          } else if (typeof dateValue === 'string') {
            // Handle DD-MM-YYYY string format
            const dateParts = dateValue.split('-');
            if (dateParts.length === 3) {
              return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            } else {
              return dateValue; // Return as is if not in DD-MM-YYYY format
            }
          }
          return ''; // Default empty string if no date value
        })(),
        value: row['value'] || null,
        stampType: row['stampType'] || undefined,
        releaseYear: row['releaseYear'] || undefined,
        stampSubHeader: row['stampSubHeader'] || undefined,
        specificStampDetails: row['specificStampDetails'] || undefined,
        celebratingYear: row['celebratingYear'] || undefined,
        extraDetails: row['extraDetails'] || undefined,
        categoryType1: row['categoryType1'] || undefined,
        categoryType2: row['categoryType2'] || undefined,
        categoryType3: row['categoryType3'] || undefined,
        comments: row['comments'] || undefined,
        location: row['location'] || undefined,
        referenceLinks: row['referenceLinks'] ? String(row['referenceLinks']).split(',') : undefined,
        files: row['files'] ? String(row['files']).split(',') : undefined,
        numberOfStamps: row['numberOfStamps'] || undefined,
        stampValues: row['stampValues'] ? String(row['stampValues']).split(',').map(Number) : undefined,
      };
      console.log('Processing stamp:', stamp.name, 'Date of Issue:', stamp.dateOfIssue); // Added console.log
      stampsToUpload.push(stamp);
    }

    // Assuming a bulk upload method in StampService
    this.stampService.addStamps(stampsToUpload).subscribe({
      next: () => {
        this.snackBar.open('Stamps uploaded successfully!', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/stamps']); // Navigate to stamps list after successful upload
      },
      error: (err) => {
        console.error('Error uploading stamps:', err);
        this.snackBar.open('Error uploading stamps. Check console for details.', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  downloadSampleExcel(): void {
    const headers: (keyof Stamp)[] = [
      'name',
      'dateOfIssue',
      'value',
      'stampType',
      'releaseYear',
      'stampSubHeader',
      'specificStampDetails',
      'celebratingYear',
      'extraDetails',
      'categoryType1',
      'categoryType2',
      'categoryType3',
      'comments',
      'location',
      'referenceLinks',
      'files',
      'numberOfStamps',
      'stampValues',
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Append the 'Stamps' sheet
    XLSX.utils.book_append_sheet(wb, ws, 'Stamps');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'sample_stamps.xlsx');
  }
}
