import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { GitCommit } from '../version-history.service';

@Component({
  selector: 'app-version-history-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-history-dialog.component.html',
  styleUrls: ['./version-history-dialog.component.css']
})
export class VersionHistoryDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VersionHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { history: GitCommit[] }
  ) { }

  ngOnInit(): void { }

  onClose(): void {
    this.dialogRef.close();
  }
}
