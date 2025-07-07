import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { version } from '../../package.json';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VersionHistoryService } from './version-history.service';
import { VersionHistoryDialogComponent } from './version-history-dialog/version-history-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stamp-collection';
  version: string = version;
  lastUpdated = '07Jul25';

  constructor(private dialog: MatDialog, private versionHistoryService: VersionHistoryService) { }

  openVersionHistory(): void {
    this.versionHistoryService.getVersionHistory().subscribe(history => {
      this.dialog.open(VersionHistoryDialogComponent, {
        width: '800px',
        data: { history }
      });
    });
  }
}
