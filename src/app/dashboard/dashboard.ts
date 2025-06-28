import { Component, OnInit } from '@angular/core';
import { StampService } from '../stamp.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalStampCount: number = 0;
  totalStampValue: number = 0;
  stampsByYear: { [year: number]: number } = {};
  stampsByCategoryType1: { [category: string]: number } = {};
  categorySummary: { category: string, count: number, totalValue: number }[] = [];

  constructor(private stampService: StampService) { }

  ngOnInit(): void {
    this.calculateSummary();
    this.calculateStampsByYear();
    this.calculateStampsByCategoryType1();
    this.calculateCategorySummary();
  }

  private calculateSummary(): void {
    const stamps = this.stampService.getStamps();
    this.totalStampCount = stamps.length;
    this.totalStampValue = stamps.reduce((sum, stamp) => sum + stamp.value, 0);
  }

  private calculateStampsByYear(): void {
    const stamps = this.stampService.getStamps();
    this.stampsByYear = {};
    stamps.forEach(stamp => {
      if (stamp.releaseYear) {
        this.stampsByYear[stamp.releaseYear] = (this.stampsByYear[stamp.releaseYear] || 0) + 1;
      }
    });
  }

  private calculateStampsByCategoryType1(): void {
    const stamps = this.stampService.getStamps();
    this.stampsByCategoryType1 = {};
    stamps.forEach(stamp => {
      if (stamp.categoryType1) {
        this.stampsByCategoryType1[stamp.categoryType1] = (this.stampsByCategoryType1[stamp.categoryType1] || 0) + 1;
      } else {
        this.stampsByCategoryType1['Uncategorized'] = (this.stampsByCategoryType1['Uncategorized'] || 0) + 1;
      }
    });
  }

  private calculateCategorySummary(): void {
    const stamps = this.stampService.getStamps();
    const summaryMap: { [category: string]: { count: number, totalValue: number } } = {};

    stamps.forEach(stamp => {
      const category = stamp.categoryType1 || 'Uncategorized';
      if (!summaryMap[category]) {
        summaryMap[category] = { count: 0, totalValue: 0 };
      }
      summaryMap[category].count++;
      summaryMap[category].totalValue += stamp.value;
    });

    this.categorySummary = Object.keys(summaryMap).map(category => ({
      category,
      count: summaryMap[category].count,
      totalValue: summaryMap[category].totalValue
    })).sort((a, b) => a.category.localeCompare(b.category));
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
}