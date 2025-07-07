import { Component, OnInit } from '@angular/core';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';
import { Stamp } from '../stamp.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalStampCount: number = 0;
  totalMiniatureSheetCount: number = 0;
  totalStampValue: number = 0;
  stampsByYear: { [year: number]: number } = {};
  miniatureSheetsByYear: { [year: number]: number } = {};
  stampsByCategoryType1: { [category: string]: number } = {};
  categorySummary: { category: string, count: number, totalValue: number }[] = [];
  stampTypeSummary: { type: string, count: number, totalValue: number }[] = [];

  constructor(private stampService: StampService) { }

  ngOnInit(): void {
    this.stampService.getStamps().subscribe(stamps => {
      this.calculateSummary(stamps);
      this.calculateStampsByYear(stamps);
      this.calculateMiniatureSheetsByYear(stamps);
      this.calculateStampsByCategoryType1(stamps);
      this.calculateCategorySummary(stamps);
      this.calculateStampTypeSummary(stamps);
    });
  }

  private calculateSummary(stamps: Stamp[]): void {
    this.totalStampCount = stamps.filter(stamp => stamp.stampType === 'Stamp').length;
    this.totalMiniatureSheetCount = stamps.filter(stamp => stamp.stampType === 'Miniature Sheet').length;
    this.totalStampValue = stamps.reduce((sum, stamp) => sum + (stamp.value ?? 0), 0);
  }

  private calculateStampsByYear(stamps: Stamp[]): void {
    this.stampsByYear = {};
    stamps.forEach(stamp => {
      if (stamp.releaseYear) {
        this.stampsByYear[stamp.releaseYear] = (this.stampsByYear[stamp.releaseYear] || 0) + 1;
      }
    });
  }

  private calculateMiniatureSheetsByYear(stamps: Stamp[]): void {
    stamps.filter(stamp => stamp.stampType === 'Miniature Sheet').forEach(stamp => {
      if (stamp.releaseYear) {
        this.miniatureSheetsByYear[stamp.releaseYear] = (this.miniatureSheetsByYear[stamp.releaseYear] || 0) + 1;
      }
    });
  }

  private calculateStampsByCategoryType1(stamps: Stamp[]): void {
    this.stampsByCategoryType1 = {};
    stamps.forEach(stamp => {
      if (stamp.categoryType1) {
        this.stampsByCategoryType1[stamp.categoryType1] = (this.stampsByCategoryType1[stamp.categoryType1] || 0) + 1;
      } else {
        this.stampsByCategoryType1['Uncategorized'] = (this.stampsByCategoryType1['Uncategorized'] || 0) + 1;
      }
    });
  }

  private calculateCategorySummary(stamps: Stamp[]): void {
    const summaryMap: { [category: string]: { count: number, totalValue: number } } = {};

    stamps.forEach(stamp => {
      const category = stamp.categoryType1 || 'Uncategorized';
      if (!summaryMap[category]) {
        summaryMap[category] = { count: 0, totalValue: 0 };
      }
      summaryMap[category].count++;
      summaryMap[category].totalValue += (stamp.value ?? 0);
    });

    this.categorySummary = Object.keys(summaryMap).map(category => ({
      category,
      count: summaryMap[category].count,
      totalValue: summaryMap[category].totalValue
    })).sort((a, b) => a.category.localeCompare(b.category));
  }

  private calculateStampTypeSummary(stamps: Stamp[]): void {
    const summaryMap: { [type: string]: { count: number, totalValue: number } } = {};

    stamps.forEach(stamp => {
      const type = stamp.stampType || 'Unspecified';
      if (!summaryMap[type]) {
        summaryMap[type] = { count: 0, totalValue: 0 };
      }
      summaryMap[type].count++;
      summaryMap[type].totalValue += (stamp.value ?? 0);
    });

    this.stampTypeSummary = Object.keys(summaryMap).map(type => ({
      type,
      count: summaryMap[type].count,
      totalValue: summaryMap[type].totalValue
    })).sort((a, b) => a.type.localeCompare(b.type));
  }

  get formattedStampsByYear(): string {
    return Object.keys(this.stampsByYear)
      .sort((a, b) => Number(a) - Number(b))
      .map(year => `${year}: ${this.stampsByYear[Number(year)]}`)
      .join(', ');
  }

  get formattedStampsByCategoryType1(): string {
    return Object.keys(this.stampsByCategoryType1)
      .sort()
      .map(category => `${category}: ${this.stampsByCategoryType1[category]}`)
      .join(', ');
  }

  get formattedMiniatureSheetsByYear(): string {
    return Object.keys(this.miniatureSheetsByYear)
      .sort((a, b) => Number(a) - Number(b))
      .map(year => `${year}: ${this.miniatureSheetsByYear[Number(year)]}`)
      .join(', ');
  }
}