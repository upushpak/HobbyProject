import { Component, OnInit } from '@angular/core';
import { Stamp } from '../stamp.model';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-stamps',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatDialogModule],
  templateUrl: './stamps.component.html',
  styleUrls: ['./stamps.component.css']
})
export class StampsComponent implements OnInit {
  stamps: Stamp[] = [];
  allStamps: Stamp[] = [];
  filters: any = {};
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

  sortColumn: string = 'dateOfIssue';
  sortDirection: string = 'desc'; // Default to newest on top

  constructor(private stampService: StampService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.allStamps = this.stampService.getStamps();
    this.applyFilters(); // Apply filters first
    this.sortData(this.sortColumn, true); // Apply default sort
  }

  applyFilters(): void {
    this.stamps = this.allStamps.filter(stamp => {
      for (let key in this.filters) {
        const filterValue = this.filters[key];
        const stampValue = (stamp as any)[key];

        if (filterValue === null || filterValue === undefined || filterValue === '') {
          continue; // Skip empty filters
        }

        if (typeof stampValue === 'string' && typeof filterValue === 'string') {
          if (!stampValue.toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
        } else if (typeof stampValue === 'number' && typeof filterValue === 'number') {
          if (stampValue !== filterValue) {
            return false;
          }
        } else if (key === 'dateOfIssue' && typeof filterValue === 'string') {
          // For date filtering, assuming filterValue is in 'YYYY-MM-DD' format from input type='date'
          // And stampValue is also in 'YYYY-MM-DD' or compatible format
          if (stampValue.substring(0, 10) !== filterValue) {
            return false;
          }
        } else if (key.startsWith('categoryType') && typeof filterValue === 'string') {
          if (stampValue !== filterValue) {
            return false;
          }
        }
      }
      return true;
    });
    this.sortData(this.sortColumn, true); // Re-apply sort after filtering
  }

  sortData(column: string, initialSort: boolean = false): void {
    if (!initialSort && this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = initialSort ? this.sortDirection : 'asc';
    }

    this.stamps.sort((a, b) => {
      const aValue = (a as any)[column];
      const bValue = (b as any)[column];

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  deleteStamp(id: number): void {
    this.stampService.deleteStamp(id);
    this.allStamps = this.stampService.getStamps(); // Update allStamps after deletion
    this.applyFilters(); // Re-apply filters and sort after deletion
  }

  confirmDelete(stamp: Stamp): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        name: stamp.name,
        dateOfIssue: stamp.dateOfIssue,
        value: stamp.value,
        categoryType1: stamp.categoryType1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteStamp(stamp.id);
      }
    });
  }
}
