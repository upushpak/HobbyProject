import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stamp } from '../stamp.model';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-stamp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-stamp.component.html',
  styleUrls: ['./edit-stamp.component.css']
})
export class EditStampComponent implements OnInit {
  stamp: Stamp | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stampService: StampService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.stamp = this.stampService.getStamp(id);
  }

  updateStamp(): void {
    if (this.stamp) {
      this.stampService.updateStamp(this.stamp);
      this.router.navigate(['/stamps']);
    }
  }
}
