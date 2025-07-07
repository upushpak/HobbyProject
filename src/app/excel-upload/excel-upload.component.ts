
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

  constructor(private stampService: StampService, private snackBar: MatSnackBar) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.processExcelData(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  processExcelData(data: any[]) {
    this.isLoading = true;
    const headers = data[0];
    const stampsToUpload: Stamp[] = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const stamp: Stamp = {
        id: 0, // Will be assigned by the service or backend
        name: row[headers.indexOf('name')],
        dateOfIssue: row[headers.indexOf('dateOfIssue')],
        value: row[headers.indexOf('value')],
        stampType: row[headers.indexOf('stampType')] || undefined,
        releaseYear: row[headers.indexOf('releaseYear')] || undefined,
        stampSubHeader: row[headers.indexOf('stampSubHeader')] || undefined,
        specificStampDetails: row[headers.indexOf('specificStampDetails')] || undefined,
        celebratingYear: row[headers.indexOf('celebratingYear')] || undefined,
        extraDetails: row[headers.indexOf('extraDetails')] || undefined,
        categoryType1: row[headers.indexOf('categoryType1')] || undefined,
        categoryType2: row[headers.indexOf('categoryType2')] || undefined,
        categoryType3: row[headers.indexOf('categoryType3')] || undefined,
        comments: row[headers.indexOf('comments')] || undefined,
        location: row[headers.indexOf('location')] || undefined,
        referenceLinks: row[headers.indexOf('referenceLinks')] ? row[headers.indexOf('referenceLinks')].split(',') : undefined,
        files: row[headers.indexOf('files')] ? row[headers.indexOf('files')].split(',') : undefined,
        numberOfStamps: row[headers.indexOf('numberOfStamps')] || undefined,
        stampValues: row[headers.indexOf('stampValues')] ? row[headers.indexOf('stampValues')].split(',').map(Number) : undefined,
      };
      stampsToUpload.push(stamp);
    }

    // Assuming a bulk upload method in StampService
    this.stampService.addStamps(stampsToUpload).subscribe({
      next: () => {
        this.snackBar.open('Stamps uploaded successfully!', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error uploading stamps:', err);
        this.snackBar.open('Error uploading stamps. Check console for details.', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  downloadSampleExcel(): void {
    const stampTypeOptions: string[] = [
      'Stamp',
      'Miniature Sheet',
      'First Day Cover',
      'Special Cover'
    ];

    const categoryOptions: string[] = [
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

    // Add a hidden sheet for dropdown values
    const dropdownWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      stampTypeOptions,
      categoryOptions
    ]);
    XLSX.utils.book_append_sheet(wb, dropdownWs, 'Dropdowns');

    // Apply data validation to the main sheet
    const stampTypeCol = headers.indexOf('stampType');
    const categoryType1Col = headers.indexOf('categoryType1');
    const categoryType2Col = headers.indexOf('categoryType2');
    const categoryType3Col = headers.indexOf('categoryType3');

    if (ws['!dataValidations'] == null) ws['!dataValidations'] = {};

    // Data validation for stampType (column D, 100 rows)
    if (stampTypeCol !== -1) {
      const stampTypeColLetter = XLSX.utils.encode_col(stampTypeCol);
      for (let i = 2; i <= 100; i++) { // Start from row 2 (after header)
        const cellRef = `${stampTypeColLetter}${i}`;
        ws['!dataValidations'][cellRef] = {
          type: 'list',
          allowBlank: true,
          formula1: `Dropdowns!$A$1:${XLSX.utils.encode_col(stampTypeOptions.length - 1)}$1`,
        };
      }
    }

    // Data validation for categoryType1, categoryType2, categoryType3 (columns K, L, M, 100 rows)
    const categoryCols = [categoryType1Col, categoryType2Col, categoryType3Col];
    categoryCols.forEach(colIndex => {
      if (colIndex !== -1) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        for (let i = 2; i <= 100; i++) { // Start from row 2 (after header)
          const cellRef = `${colLetter}${i}`;
          ws['!dataValidations'][cellRef] = {
            type: 'list',
            allowBlank: true,
            formula1: `Dropdowns!$A$2:${XLSX.utils.encode_col(categoryOptions.length - 1)}$2`,
          };
        }
      }
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Stamps');

    // Hide the Dropdowns sheet
    if (!wb.Workbook) wb.Workbook = {};
    if (!wb.Workbook.Sheets) wb.Workbook.Sheets = [];
    wb.Workbook.Sheets.push({
      Hidden: 1
    });

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'sample_stamps.xlsx');
  }
}
